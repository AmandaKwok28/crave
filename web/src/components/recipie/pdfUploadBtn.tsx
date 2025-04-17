import * as pdfjs from 'pdfjs-dist';
import { TextItem, TextMarkedContent } from 'pdfjs-dist/types/src/display/api';
import { useRef, useState } from 'react';
import { Button, Flex, Input, Spinner } from '@chakra-ui/react';
import { fetchPdfContent } from '@/data/pdf-api';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';   // set pdf rendering opti

const isTextItem = (item: TextItem | TextMarkedContent): item is TextItem => {
    return (item as TextItem).str !== undefined; // Checking if 'str' exists on the item
};
  

const PDFUpload = () => {

    const fileInputRef = useRef<HTMLInputElement | null>(null);  // reference for the file input
    const [validFile, setValidFile] = useState<string | null>(null);  
    const [loading, setLoading] = useState<boolean>(false);
    
    const getContent = async(src:string) => {
        const doc = pdfjs.getDocument(src).promise;
        const page = (await doc).getPage(1);          // get page 1 content...
        return (await page).getTextContent();
    }

    const getItems = async(src:string) => {
        const content = await getContent(src);
        const items = content.items.map((item) => {
            if (isTextItem(item)) {
                return item.str; 
            }
            return '';
        })
        return items;
    }

    // getItems("./sample.pdf")   // test on sample pdf in the public folder

    const handleClick = () => {
        fileInputRef.current?.click();  // Trigger the hidden file input click
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true);
        const file = e.target.files?.[0];
        if (file) {
            setValidFile(file.name);                       // Display the file name            
            const fileUrl = URL.createObjectURL(file);     // Create a URL for the file
            const extractedText = await getItems(fileUrl); // Call getItems to extract and log text

            // note to anirudh: use this to call the hook you define for making the gpt call :)
            let response;
            try {
                response = await fetchPdfContent(extractedText.join(' '));
                setTimeout(() => {
                }, 2000);
            } catch (error) {
                console.log(error)
            } finally {
                console.log(response)
                setLoading(false);
            }
            
        }
    };

    return (
        <Flex direction="column" mt={4}>
            {/* Hidden file input element */}
            <input
                type="file"
                accept="application/pdf"  // Only allow PDF files
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}  // Handle file selection
            />

            {/* Upload button to trigger file input */}
            <Button 
                onClick={handleClick}
                bg="cyan.500" 
                color="white"
                maxW="80%" 
                w="100%" 
                borderRadius="md"
                _hover={{ bg: "cyan.600" }}
            >
                {loading ? <Spinner size="lg" color="white" /> : "Upload PDF"}
            </Button>

            {/* Show file name */}
            {validFile && (
                <Input
                    value={validFile}
                    maxW="80%"
                    mt={2}
                    readOnly
                    borderRadius="md"
                    disabled
                    _disabled={{
                        cursor: 'default',  // This removes the cancel symbol and gives a normal cursor
                    }}
                />
            )}
        </Flex>
    );
 
};

export default PDFUpload;




