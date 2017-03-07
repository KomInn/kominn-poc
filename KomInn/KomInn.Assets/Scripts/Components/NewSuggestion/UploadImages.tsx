import * as React from "react";
import { Row, Col } from "react-bootstrap";


interface UploadImagesProps { onDataUpdate?(pictureURL:string):void }
interface UploadImagesState { uploadedImageUrl:string }
export class UploadImages extends React.Component<UploadImagesProps, UploadImagesState>
{
    constructor()
    {
        super(); 
        this.state = { uploadedImageUrl:"" };
    }

    uploadImage(val:HTMLInputElement)
    {
        console.log(val.files);
        
    }
    render()
    {
        var uploadedImg = this.state.uploadedImageUrl; 
        return (
<Row>                 
    <Col xs={12}>        
        <div className="form-area">
            {(uploadedImg.length > 0) ? <img src={uploadedImg} width={500} /> : ""}
	        <strong className="title">Bilder (valgfritt)</strong>
			<p>Bildene må være mindre enn 1.5 Mb, og av typen .png, .jpg eller .gif</p>
            <input type="file" 
                style={{height:0, overflow:"hidden", position:"absolute", top:"-10000px"}} 
                id="fileUpload" 
                onChange={this.uploadImage.bind(this)} />
			<a href="#" className="btn" onClick={() => { $("#fileUpload").click() }} >Velg bilder</a>            
        </div>
     
    </Col>
</Row>                    
        )
    }
}