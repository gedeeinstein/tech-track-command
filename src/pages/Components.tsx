
import React from "react";
import { useComponents } from "@/features/components/hooks/useComponents";
import SearchAndViewControls from "@/features/components/components/SearchAndViewControls";
import ComponentGrid from "@/features/components/components/ComponentGrid";
import ComponentList from "@/features/components/components/ComponentList";
import ComponentFormDialog from "@/features/components/components/ComponentFormDialog";
import ComponentLoadingState from "@/features/components/components/ComponentLoadingState";

const Components: React.FC = () => {
  const {
    components,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    formOpen,
    setFormOpen,
    currentComponent,
    isLoading,
    handleAddEdit,
    handleSaveComponent,
    handleDeleteComponent
  } = useComponents();

  return (
    <div className="space-y-6">
      {/* Header with search and view toggles */}
      <SearchAndViewControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddComponent={() => handleAddEdit()}
      />

      {/* Loading state */}
      {isLoading && <ComponentLoadingState />}

      {/* Components Grid/List View */}
      {!isLoading && (
        viewMode === "grid" ? (
          <ComponentGrid
            components={components}
            onEdit={handleAddEdit}
            onDelete={handleDeleteComponent}
            isLoading={isLoading}
          />
        ) : (
          <ComponentList
            components={components}
            onEdit={handleAddEdit}
            onDelete={handleDeleteComponent}
            isLoading={isLoading}
          />
        )
      )}

      {/* Add/Edit Component Form Dialog */}
      <ComponentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSaveComponent}
        currentComponent={currentComponent}
      />
    </div>
  );
};

export default Components;
