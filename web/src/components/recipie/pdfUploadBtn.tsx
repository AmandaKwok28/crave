import * as pdfjs from 'pdfjs-dist';
import { TextItem, TextMarkedContent } from 'pdfjs-dist/types/src/display/api';
import { useRef, useState } from 'react';
import { Button, Flex, Input, Text } from '@chakra-ui/react';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';   // set pdf rendering opti

const isTextItem = (item: TextItem | TextMarkedContent): item is TextItem => {
    return (item as TextItem).str !== undefined; // Checking if 'str' exists on the item
};
  

const PDFUpload = () => {

    const fileInputRef = useRef<HTMLInputElement | null>(null);  // reference for the file input
    const [validFile, setValidFile] = useState<string | null>(null);  
    const [pdfText, setPdfText] = useState<string>('');
    
    const getContent = async(src:string) => {
        const doc = pdfjs.getDocument(src).promise;
        const page = (await doc).getPage(1);          // get page 1 content...
        return (await page).getTextContent();
    }

    const getItems = async(src:string) => {
        const content = await getContent(src);
        const items = content.items.map((item) => {
            if (isTextItem(item)) {
                console.log(item.str)
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
        const file = e.target.files?.[0];
        if (file) {
            setValidFile(file.name);  // Display the file name

            // Create a URL for the file
            const fileUrl = URL.createObjectURL(file);

            // Call getItems to extract and log text
            const extractedText = await getItems(fileUrl);
            setPdfText(extractedText.join(' '));  // Store the extracted text in state
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
                Upload PDF
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

            {/* Display parsed PDF text */}
            {pdfText && (
                <Text 
                    mt={4} 
                    border="1px" 
                    borderRadius="md" 
                    bg="gray.100" 
                    width="80%" 
                    p={4}
                    overflow="auto"
                >
                    {pdfText}
                </Text>
            )}
        </Flex>
    );
 
};

export default PDFUpload;

// import React, { useState, useRef } from 'react';
// import { Button, Flex, Input, Text } from '@chakra-ui/react';
// import * as pdfjsLib from 'pdfjs-dist'; // Import from webpack build for browser support

// const PDFUpload = () => {
//   const [validFile, setValidFile] = useState<string | null>(null);
//   const [pdfText, setPdfText] = useState<string>('');
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setValidFile(file.name); // Display the file name

//       // Read the PDF file
//       const fileReader = new FileReader();
//       fileReader.onload = async () => {
//         const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);

//         try {
//           const pdf = await pdfjsLib.getDocument(typedArray).promise;
//           const numPages = pdf.numPages;
//           let text = '';

//           // Extract text from each page
//           for (let i = 1; i <= numPages; i++) {
//             const page = await pdf.getPage(i);
//             const content = await page.getTextContent();
//             const pageText = content.items.map((item: any) => item.str).join(' ');
//             text += pageText + '\n';
//           }

//           setPdfText(text); // Store the parsed text from the PDF
//           console.log(text)
//         } catch (error) {
//           console.error('Error parsing PDF:', error);
//         }
//       };

//       fileReader.readAsArrayBuffer(file); // Read the file as an array buffer
//     }
//   };

//   const handleClick = () => {
//     fileInputRef.current?.click(); // trigger the file input click on button click
//   };

//   return (
//     <Flex direction="column" mt={4}>
//       {/* Hidden file input */}
//       <input
//         type="file"
//         accept="application/pdf" // Only allowing PDFs
//         ref={fileInputRef}
//         style={{ display: 'none' }}
//         onChange={handleFileChange}
//       />

//       {/* Upload button */}
//       <Button
//         maxW="80%"
//         w="100%"
//         bg="cyan.500"
//         onClick={handleClick}
//       >
//         Upload PDF
//       </Button>

//       {/* Show file name */}
//       {validFile && (
//         <Input
//           value={validFile}
//           maxW="80%"
//           mt={2}
//           readOnly
//           borderRadius="md"
//           disabled
//           _disabled={{
//             cursor: 'default', // This removes the cancel symbol and gives a normal cursor
//           }}
//         />
//       )}

//       {/* Display parsed PDF text */}
//       {pdfText && (
//         <Text mt={4} border="1px" borderRadius="md" bg="gray.100" width="80%">
//           {pdfText}
//         </Text>
//       )}
//     </Flex>
//   );
// };

// export default PDFUpload;
