import React from "react";
import logo from './logo.svg';
import './App.css';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import download from 'downloadjs';
import myPdf from "./with_update_sections.pdf";
import readXlsxFile from 'read-excel-file';

function App() {
const openFile = function(event) {
	console.log("open file called");
    const files = event.target.files[0];
    files.arrayBuffer().then(buffer => {
		console.log("buffer thing: "+ buffer);
		downloadFile(buffer);
		return buffer;
	});
};
const [pensionerData, setPensionerData] = React.useState("");
const modifyPdf = () => {
	console.log("my pdf: "+ JSON.stringify(myPdf));
	const file = new File(myPdf, 'myFIle');
}

async function downloadFile(bytes) {
	const pdfDoc = await PDFDocument.load(bytes);
	const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);
	const pages = pdfDoc.getPages();
	pensionerData.map((row, index) => {
		if(index != 0){
			const page = pages[row[2] - 1];
			if(row[1] != null && row[1] != "")
			//const { width, height } = firstPage.getSize();
			page.drawText(row[1].toString(), {
				x: row[3],
				y: row[4],
				size: 12,
				font: helveticaFont,
				color: rgb(0.95, 0.1, 0.1),
			});
		}
		
	});
	
  	const pdfBytes = await pdfDoc.save()
	download(pdfBytes, "pdf-lib_modifications.pdf", "application/pdf");
}

const openExcel = (e) => {
	readXlsxFile(e.target.files[0]).then((rows) => {
		setPensionerData(rows);
	})
}

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
		<div>
			<span>Upload excel file: </span>
			<input type='file' class="upload" onChange={(e) => openExcel(e)}/>
		</div>
		<div>
			<span>Upload pdf file: </span>
			<input type='file' onChange={(e) => openFile(e)} class="upload"/>
		</div>
		
      </header>
    </div>
  );
}

export default App;
