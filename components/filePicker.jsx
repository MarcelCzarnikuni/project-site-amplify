import * as React from 'react';
import { Button, DropZone, Flex, Text, VisuallyHidden, ThemeProvider } from '@aws-amplify/ui-react';

const theme = {
    name: 'custom-theme',
    tokens: {
      components: {
        card: {
          backgroundColor: { value: '{colors.background.secondary}' },
          outlined: {
            borderColor: { value: '{colors.black}' },
          },
        },
        heading: {
          color: { value: 'white' },
        },
        text: {
          color: { value: 'white' },
        },
      },
    },
  };

const acceptedFileTypes = ['image/png', 'image/jpeg'];

export default function DropZoneInput({ selectedFiles }) {
    const [files, setFiles] = React.useState([]);
    const hiddenInput = React.useRef(null);

    const onFilePickerChange = (event) => {
        const { files } = event.target;
        if (!files || files.length === 0) {
            return;
        }
        setFiles(Array.from(files));
        selectedFiles(Array.from(files))
    };

    return (
        <>
        <ThemeProvider>
            <DropZone
                acceptedFileTypes={acceptedFileTypes}
                onDropComplete={({ acceptedFiles, rejectedFiles }) => {
                    setFiles(acceptedFiles);
                }}
            >
                <Flex direction="column" alignItems="center">
                    <Text>Drag images here or select file</Text>
                    <Button size="small" onClick={() => hiddenInput.current.click()}>
                        Browse
                    </Button>
                </Flex>
                <VisuallyHidden>
                    <input
                        type="file"
                        tabIndex={-1}
                        ref={hiddenInput}
                        onChange={onFilePickerChange}
                        multiple={true}
                        accept={acceptedFileTypes.join(',')}
                    />
                </VisuallyHidden>
            </DropZone>
            {files.map((file) => (
                <Text style={{ color: 'white' }} key={file.name}>{file.name}</Text>
            ))}
            </ThemeProvider>
        </>
    );
}