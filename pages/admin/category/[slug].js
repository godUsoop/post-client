import Layout from "../../../components/Layout";
import withAdmin from "../../withAdmin";
import axios from "axios";
import {useState, useEffect} from "react";
import {env} from "../../../next.config";
import {successMessageBox, errorMessageBox} from "../../../helpers/alert";
import Resizer from 'react-image-file-resizer';


// dynamic input; react-quill run in the client
// but next.js run both server and client side
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), {ssr: false});
import 'react-quill/dist/quill.bubble.css';

const Update = ({ oldCategory, token }) => {
    const [state, setState] = useState({
        name: oldCategory.name,
        error: '',
        success: '',
        buttonText: 'Update',
        imagePreview: oldCategory.image.url,
        image: ''
    });
    const [content, setContent] = useState(oldCategory.content);
    const [imageUploadButtonName, setImageUploadButtonName] = useState('Update image');

    const { name, success, error, image, buttonText, imagePreview } = state;

    const handleChange = name => e => {
        setState({ ...state, [name]: e.target.value, error: '', success: '' });
    };

    const handleContent = e => {
        console.log(e);
        setContent(e);
        setState({ ...state, success: '', error: '' });
    };

    const handleImage = event => {
        let fileInput = false;
        if (event.target.files[0]) {
            fileInput = true;
        }
        setImageUploadButtonName(event.target.files[0].name);
        if (fileInput) {
            Resizer.imageFileResizer(
                event.target.files[0],
                300,
                300,
                'JPEG',
                100,
                0,
                uri => {
                    // console.log(uri);
                    setState({ ...state, image: uri, success: '', error: '' });
                },
                'base64'
            );
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setState({ ...state, buttonText: 'Updating' });
        console.table({ name, content, image });
        try {
            const response = await axios.put(
                `${env.API}/category/${oldCategory.slug}`,
                { name, content, image },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log('CATEGORY UPDATE RESPONSE', response);
            setState({
                ...state,
                imagePreview: response.data.image.url,
                success: `${response.data.name} is updated`
            });
            setContent(response.data.content);
        } catch (error) {
            console.log('CATEGORY CREATE ERROR', error);
            setState({ ...state, buttonText: 'Create', error: error.response.data.error });
        }
    };

    const updateCategoryForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange('name')} value={name} type="text" className="form-control" required />
            </div>
            <div className="form-group">
                <label className="text-muted">Content</label>
                <ReactQuill
                    value={content}
                    onChange={handleContent}
                    placeholder="Write something..."
                    theme="bubble"
                    className="pb-5 mb-3"
                    style={{ border: '1px solid #666' }}
                />
            </div>
            <div className="form-group">
                <label className="btn btn-outline-secondary">
                    {imageUploadButtonName}{' '}
                    <span>
                        <img src={imagePreview} alt="image" height="20" />
                    </span>
                    <input onChange={handleImage} type="file" accept="image/*" className="form-control" hidden />
                </label>
            </div>
            <div>
                <button className="btn btn-outline-warning">{buttonText}</button>
            </div>
        </form>
    );

    return (
        <Layout>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h1>Update category</h1>
                    <br />
                    {success && successMessageBox(success)}
                    {error && errorMessageBox(error)}
                    {updateCategoryForm()}
                </div>
            </div>
        </Layout>
    );
};

Update.getInitialProps = async ({ req, query}) => {
    const response = await axios.post(`${env.API}/category/${query.slug}`);
    return { oldCategory: response.data.category};
};

export default withAdmin(Update);