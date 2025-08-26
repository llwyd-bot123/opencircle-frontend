# useConfirmationModal Hook

A reusable hook for managing confirmation modals throughout the application.

## Usage

```tsx
import { useConfirmationModal } from "../hooks";
import { ConfirmationModal } from "../components/modals";

function MyComponent() {
  const {
    isConfirmModalOpen,
    modalConfig,
    openConfirmationModal,
    closeConfirmationModal,
  } = useConfirmationModal();

  const handleDeleteUser = (userId: string) => {
    openConfirmationModal({
      title: "Delete User",
      message:
        "Are you sure you want to delete this user? This action cannot be undone.",
      confirmButtonText: "Delete",
      confirmButtonVariant: "danger",
      onConfirm: () => {
        // Your delete logic here
        console.log("Deleting user:", userId);
      },
    });
  };

  return (
    <div>
      <button onClick={() => handleDeleteUser("123")}>Delete User</button>

      {/* Add the modal to your JSX */}
      {modalConfig && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={closeConfirmationModal}
          onConfirm={modalConfig.onConfirm}
          title={modalConfig.title}
          message={modalConfig.message}
          confirmButtonText={modalConfig.confirmButtonText}
          confirmButtonVariant={modalConfig.confirmButtonVariant}
        />
      )}
    </div>
  );
}
```

## API

### Returns

- `isConfirmModalOpen`: boolean - Whether the modal is currently open
- `modalConfig`: ModalConfig | null - Current modal configuration
- `openConfirmationModal(config)`: Function to open the modal with configuration
- `closeConfirmationModal()`: Function to close the modal

### ModalConfig Interface

```tsx
interface ModalConfig {
  title: string;
  message: string;
  confirmButtonText: string;
  confirmButtonVariant: "primary" | "danger";
  onConfirm: () => void;
}
```

## Benefits

- **DRY Principle**: Reuse the same confirmation modal logic across components
- **Consistent UX**: Same modal behavior throughout the app
- **Type Safety**: Full TypeScript support
- **Clean Code**: Separates modal logic from component logic
