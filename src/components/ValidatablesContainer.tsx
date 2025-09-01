import { FC, PropsWithChildren, type ReactNode, useRef } from 'react';

interface ValidatablesContainerProps {
    onElementChanged: (element: HTMLElement) => void;
    onElementTouched: (element: HTMLElement) => void;
    onElementAdded: (element: HTMLElement) => void;
    onElementRemoved: (element: HTMLElement) => void;
    onElementBlur: (element: HTMLElement) => void;
    onElementInput: (element: HTMLElement) => void;
    children: ReactNode | ((props: ChildrenCallbackProps) => ReactNode);
}

export const ValidatablesContainer: FC<ValidatablesContainerProps> = ({
    children,
}) => {
    const fieldsContainerRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={fieldsContainerRef} style={{display: 'contents'}}>
            {children}
        </div>
    )
}
