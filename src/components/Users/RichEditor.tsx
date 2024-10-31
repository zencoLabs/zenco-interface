import { ReactNode, useCallback, useEffect } from 'react';
import ImageResizer from 'react-image-file-resizer';
import { useQuill } from 'react-quilljs';
// import 'react-image-crop/dist/ReactCrop.css';

type EditoryModalProps = {
    title?: ReactNode;
    setContent: (html: string) => void;
};

export const RichEditor = ({
    setContent
}: EditoryModalProps) => {  
    const theme = 'snow'; 

    const modules = {
        toolbar: {
            container: [
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                // [{ size: ['small', false, 'large', 'huge'] }],
                ['link', 'image'],//['link', 'image', 'video'],
                [{ align: [] }],
                // [{ color: [] }, { background: [] }],
                [{ color: [] }],
                ['code-block'],
                ['clean'],
            ],
            // handlers: {
            //     image: imageHandler,
            // },
        },
        clipboard: {
            matchVisual: false,
        },
    }

    const placeholder = '' //'new topic...';

    const formats = [
        'bold', 'italic', 'underline', 'strike',
        'align', 'list', 'indent',
        'size', 'header',
        'link', 'image', 'video',
        'color', 'background',
        'clean', 'code-block',
    ]

    const { quill, quillRef } = useQuill({
        theme,
        placeholder,
        modules,
        formats
    });

    useEffect(() => {
        if (quill) { 
            quill.on('text-change', (delta, oldDelta, source) => {
                // console.log('Text change!');
                // console.log(quill.getText()); // Get text only
                // console.log(quill.getContents()); // Get delta contents
                // console.log('Text change------------------------!');
                // console.log(quill.root.innerHTML); // Get innerHTML using quill
                // console.log(quillRef.current.firstChild.innerHTML); // Get innerHTML using quillRef
                const txt = quill.getText().replace(/\n/g, '')
                if (txt && txt.length > 0) {
                    setContent(quill.root.innerHTML)
                } else {
                    setContent('')
                }
            });
            (quill.getModule('toolbar') as any).addHandler('image', imageHandler);

        }
    }, [quill]);

    const getImageCount = () => {
        if (quill) {
            const contents = quill.getContents();
            const images = contents.ops.filter(op => op.insert && (op.insert as any).image);
            return images.length;
        }
        return 0;
    };

    function imageHandler() {
        const currentImageCount = getImageCount();
        if (currentImageCount >= 6) {
            alert('You can only upload a maximum of 6 images.');
            return;
        }

        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();


        input.onchange = () => {
            const file = input.files && input.files[0];

            if (file) {
                // Resize the image before inserting it into the editor
                ImageResizer.imageFileResizer(
                    file,
                    800, // max width
                    800, // max height
                    'JPEG', // compress format
                    80, // quality
                    0, // rotation
                    (uri) => {
                        // uri is the resized image in base64 format
                        if (quill) { 
                            const range = quill.getSelection(true);
                            const position = range?.index ?? 0;
                            quill.insertEmbed(position, 'image', uri);
                            quill.setSelection(position + 1, 0); // Move the cursor to the right of the image 
                        }
                    },
                    'base64' // output type
                );

            }
        };
    }



    return (
        <div className="bodhi-editor">
            <div ref={quillRef} />
        </div>
    );
};
