import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface ExpiredModalProps {
  open: boolean;
  onClose: () => void;
}

const SubscriptionExpiredModal = ({ open, onClose }: ExpiredModalProps) => (
  <AlertDialog open={open} onOpenChange={onClose}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Subscription Expired</AlertDialogTitle>
        <AlertDialogDescription>
          Your subscription has expired. Please renew your plan to re-activate your profile and continue using all features.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction>Renew Now</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default SubscriptionExpiredModal;
