
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
    console.log("Fetching assemblies...");
    // fetch assemblies
    const { data: assemblies, error: asmError } = await supabase
      .from("assemblies")
      .select("*");

    if (asmError) {
      console.error("Error fetching assemblies:", asmError);
      throw asmError;
    }

    console.log("Fetched assemblies:", assemblies);

    // fetch assembly-assets relations
    const { data: links, error: linkError } = await supabase
      .from("assembly_assets")
      .select("*");

    if (linkError) {
      console.error("Error fetching assembly_assets links:", linkError);
      throw linkError;
    }

    console.log("Fetched assembly_assets links:", links);
    
    // Fetch all assets to get their details
    const { data: assets, error: assetError } = await supabase
      .from("assets")
      .select("*");
      
    if (assetError) {
      console.error("Error fetching assets:", assetError);
      throw assetError;
    }
    
    console.log("Fetched assets for components:", assets);

    // assemble component id lists with proper details
    const assemblyMap: Record<string, Array<{id: string, name: string, type: string}>> = {};
    (links || []).forEach(link => {
      if (!assemblyMap[link.assembly_id]) assemblyMap[link.assembly_id] = [];
      
      // Find the asset details
      const asset = assets?.find(a => a.id === link.asset_id);
      
      assemblyMap[link.assembly_id].push({
        id: link.asset_id,
        name: asset ? asset.name : `Component ${link.asset_id}`,
        type: asset ? asset.type : "Unknown"
      });
    });

    console.log("Assembled component map with details:", assemblyMap);

    return (assemblies || []).map(a => {
      const result = dbToAssembly(a, []);
      // Replace the empty components array with the detailed components
      result.components = assemblyMap[a.id] || [];
      return result;
    });
  } catch (error) {
    console.error("Error in fetchAssemblies:", error);
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
    console.log("Creating assembly:", assembly);
    const { name, description, status, location, lastMaintenance, nextMaintenance, components } = assembly;
    // 1. Insert into assemblies table
    const asmId = `ASM${Math.random().toString(36).substring(2,8).toUpperCase()}`;

    console.log("Generated assembly ID:", asmId);

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

    if (asmError) {
      console.error("Error inserting assembly:", asmError);
      throw asmError;
    }

    console.log("Created assembly in database:", asm);

    // 2. Insert component links
    const inserts = (components || []).map(componentId => ({
      assembly_id: asmId,
      asset_id: componentId,
    }));

    console.log("Preparing to insert assembly_assets links:", inserts);

    if (inserts.length) {
      const { error: linkError } = await supabase
        .from("assembly_assets")
        .insert(inserts);

      if (linkError) {
        console.error("Error inserting assembly_assets links:", linkError);
        throw linkError;
      }
      
      console.log("Inserted assembly_assets links");
    }

    toast({ title: "Assembly Created", description: `${name} was created.` });
    return dbToAssembly(asm, components);
  } catch (error) {
    console.error("Error in createAssembly:", error);
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
    console.log("Updating assembly:", id, assembly);
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
      
    if (asmError) {
      console.error("Error updating assembly:", asmError);
      throw asmError;
    }

    console.log("Updated assembly in database:", asm);

    // 2. Remove all old links and add new links in assembly_assets
    // Delete old
    const { error: deleteError } = await supabase
      .from("assembly_assets")
      .delete()
      .eq("assembly_id", id);
      
    if (deleteError) {
      console.error("Error deleting old assembly_assets links:", deleteError);
      throw deleteError;
    }
    
    console.log("Deleted old assembly_assets links");

    // Insert new
    const inserts = (components || []).map(componentId => ({
      assembly_id: id,
      asset_id: componentId,
    }));

    console.log("Preparing to insert new assembly_assets links:", inserts);

    if (inserts.length) {
      const { error: linkError } = await supabase
        .from("assembly_assets")
        .insert(inserts);

      if (linkError) {
        console.error("Error inserting new assembly_assets links:", linkError);
        throw linkError;
      }
      
      console.log("Inserted new assembly_assets links");
    }

    toast({ title: "Assembly Updated", description: `${name} was updated.` });
    return dbToAssembly(asm, components);
  } catch (error) {
    console.error("Error in updateAssembly:", error);
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
    console.log("Deleting assembly:", id);
    // Remove links
    const { error: linkError } = await supabase
      .from("assembly_assets")
      .delete()
      .eq("assembly_id", id);
      
    if (linkError) {
      console.error("Error deleting assembly_assets links:", linkError);
      throw linkError;
    }
    
    console.log("Deleted assembly_assets links");
    
    // Remove the assembly
    const { error } = await supabase
      .from("assemblies")
      .delete()
      .eq("id", id);
      
    if (error) {
      console.error("Error deleting assembly:", error);
      throw error;
    }
    
    console.log("Deleted assembly");
    
    toast({ title: "Assembly Deleted", description: "The assembly has been removed." });
    return true;
  } catch (error) {
    console.error("Error in deleteAssembly:", error);
    toast({
      title: "Error deleting assembly",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive"
    });
    return false;
  }
}
