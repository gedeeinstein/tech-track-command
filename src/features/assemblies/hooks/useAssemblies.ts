
import { useState, useEffect } from "react";
import { Assembly } from "../types";
import { fetchAssemblies, createAssembly, updateAssembly, deleteAssembly } from "@/services/assemblyService";
import { fetchAssets } from "@/services/assetService";
import { Asset } from "../types";
import { toast } from "@/hooks/use-toast";

export function useAssemblies() {
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from database on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const assembliesData = await fetchAssemblies();
        setAssemblies(assembliesData);

        const assetsData = await fetchAssets();
        setAssets(assetsData);
      } catch (error) {
        toast({
          title: "Error loading data",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive"
        });
      }
      setLoading(false);
    };
    loadData();
  }, []);

  // Map assetId to Asset information for selectedComponents
  function getComponentObjects(ids: string[]) {
    return ids.map(id => {
      const asset = assets.find(a => a.id === id);
      return { id, name: asset ? asset.name : `Component ${id}`, type: asset ? asset.type : "Unknown" };
    });
  }

  const create = async (assemblyInput, selectedComponents) => {
    const created = await createAssembly({ ...assemblyInput, components: selectedComponents });
    if (created) {
      setAssemblies(prev => [
        ...prev,
        { ...created, components: getComponentObjects(selectedComponents) }
      ]);
    }
    return created;
  };

  const update = async (id, assemblyInput, selectedComponents) => {
    const updated = await updateAssembly(id, { ...assemblyInput, components: selectedComponents });
    if (updated) {
      setAssemblies(prev =>
        prev.map(a => a.id === id ? { ...updated, components: getComponentObjects(selectedComponents) } : a)
      );
    }
    return updated;
  };

  const remove = async (id: string) => {
    const ok = await deleteAssembly(id);
    if (ok) setAssemblies(prev => prev.filter(a => a.id !== id));
    return ok;
  };

  return {
    assemblies,
    setAssemblies,
    assets,
    setAssets,
    loading,
    getComponentObjects,
    create,
    update,
    remove,
  };
}
