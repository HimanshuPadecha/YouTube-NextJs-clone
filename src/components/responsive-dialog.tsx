import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";

interface ReasponsiveModalProps {
    children:React.ReactElement
    open:boolean
    title:string
    onOpenChange: (open : boolean) => void
}

export const  ResponsiveModal = ({
    children,
    open,
    title,
    onOpenChange
}:ReasponsiveModalProps) => {
    const isMobile = useIsMobile()

    if(isMobile){
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>
                            {title}
                        </DrawerTitle>
                    </DrawerHeader>
                            {children}
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {title}
                    </DialogTitle>
                </DialogHeader>
                        {children}
            </DialogContent>
        </Dialog>
    )
}