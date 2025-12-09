import { Button, Dialog } from "@chakra-ui/react";

export const AlertDialog = ({
  open,
  onOpenChange,
  title,
  bodyText,
  onYes,
  onNo,
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} role="alertdialog">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content mx="3">
          <Dialog.Header>
            <Dialog.Title>{title}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>{bodyText}</Dialog.Body>
          <Dialog.Footer>
            <Button variant="outline" onClick={onNo}>
              No
            </Button>
            <Button colorPalette="red" onClick={onYes}>
              Yes
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
