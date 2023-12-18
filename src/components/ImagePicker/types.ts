export type ImagePickerProps = {
    imageWrapperClassName?: string;
    url: string;
    onUrlChange: (url: string) => void;
    errorMessage?: React.ReactNode;
};
