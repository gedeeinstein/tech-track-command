
import { supabase } from "@/integrations/supabase/client";
import { Assembly, Component } from "@/features/assemblies/types";
import { toast } from "@/components/ui/use-toast";

// Helper: Convert database row to Assembly object
function dbToAssembly(db: any, componentIds: string[] = []): Assembly {
  return {
    id: db.id,
    name: db.name,
    description: db.description,
    status: db.status as Assembly["status"],
    location: db.location,
    components: componentIds.map(id => ({ id, name: "", type: "Unknown" })), // real names fetched elsewhere
    lastMaintenance: db.last_maintenance,
    nextMaintenance: db.next_maintenance,
  };
}

// Fetch all assemblies with their components
export async function fetchAssemblies(): Promise<Assembly[]> {
  try {
    // fetch assemblies
    const { data: assemblies, error: asmError } = await supabase
      .from("assemblies")
      .select("*");

    if (asmError) throw asmError;

    // fetch assembly-assets relations
    const { data: links, error: linkError } = await supabase
      .from("assembly_assets")
      .select("*");

    if (linkError) throw linkError;

    // assemble component id lists
    const assemblyMap: Record<string, string[]> = {};
    (links || []).forEach(link => {
      if (!assemblyMap[link.assembly_id]) assemblyMap[link.assembly_id] = [];
      assemblyMap[link.assembly_id].push(link.asset_id);
    });

    return (assemblies || []).map(a => dbToAssembly(a, assemblyMap[a.id] || []));
  } catch (error) {
    toast({
      title: "Error fetching assemblies",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive"
    });
    return [];
  }
}

// Create a new assembly and attach components
export async function createAssembly(
  assembly: Omit<Assembly, "id" | "components"> & { components: string[] }
): Promise<Assembly | null> {
  try {
    const { name, description, status, location, lastMaintenance, nextMaintenance, components } = assembly;
    // 1. Insert into assemblies table
    const asmId = `ASM${Math.random().toString(36).substring(2,8).toUpperCase()}`;

    const { data: asm, error: asmError } = await supabase
      .from("assemblies")
      .insert({
        id: asmId,
        name,
        description,
        status,
        location,
        last_maintenance: lastMaintenance,
        next_maintenance: nextMaintenance,
      })
      .select("*")
      .single();

    if (asmError) throw asmError;

    // 2. Insert component links
    const inserts = (components || []).map(componentId => ({
      assembly_id: asmId,
      asset_id: componentId,
    }));

    if (inserts.length) {
      const { error: linkError } = await supabase
        .from("assembly_assets")
        .insert(inserts);

      if (linkError) throw linkError;
    }

    toast({ title: "Assembly Created", description: `${name} was created.` });
    return dbToAssembly(asm, components);
  } catch (error) {
    toast({
      title: "Error creating assembly",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive"
    });
    return null;
  }
}

// Update an assembly and its components
export async function updateAssembly(
  id: string,
  assembly: Omit<Assembly, "id" | "components"> & { components: string[] }
): Promise<Assembly | null> {
  try {
    const { name, description, status, location, lastMaintenance, nextMaintenance, components } = assembly;
    // 1. Update assemblies table
    const { data: asm, error: asmError } = await supabase
      .from("assemblies")
      .update({
        name,
        description,
        status,
        location,
        last_maintenance: lastMaintenance,
        next_maintenance: nextMaintenance,
      })
      .eq("id", id)
      .select("*")
      .single();
    if (asmError) throw asmError;

    // 2. Remove all old links and add new links in assembly_assets
    // Delete old
    await supabase
      .from("assembly_assets")
      .delete()
      .eq("assembly_id", id);

    // Insert new
    const inserts = (components || []).map(componentId => ({
      assembly_id: id,
      asset_id: componentId,
    }));

    if (inserts.length) {
      const { error: linkError } = await supabase
        .from("assembly_assets")
        .insert(inserts);

      if (linkError) throw linkError;
    }

    toast({ title: "Assembly Updated", description: `${name} was updated.` });
    return dbToAssembly(asm, components);
  } catch (error) {
    toast({
      title: "Error updating assembly",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive"
    });
    return null;
  }
}

// Delete assembly and associated links
export async function deleteAssembly(id: string): Promise<boolean> {
  try {
    // Remove links
    await supabase.from("assembly_assets").delete().eq("assembly_id", id);
    // Remove the assembly
    const { error } = await supabase.from("assemblies").delete().eq("id", id);
    if (error) throw error;
    toast({ title: "Assembly Deleted", description: "The assembly has been removed." });
    return true;
  } catch (error) {
    toast({
      title: "Error deleting assembly",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive"
    });
    return false;
  }
}
