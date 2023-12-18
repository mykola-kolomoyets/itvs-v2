export type ImagePickerProps = {
    url: string;
    onUrlChange: (url: string) => void;
    errorMessage?: React.ReactNode;
};
