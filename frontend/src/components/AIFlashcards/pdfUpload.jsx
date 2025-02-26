import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/axios';

const PDFUploader = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile?.type !== 'application/pdf') {
            toast.error('Please upload a PDF file');
            return;
        }
        setFile(selectedFile);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.warning('Please select a PDF file');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('pdf', file);

        try {
            const response = await api.post('/ai-flashcards/upload-pdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            toast.success('Flashcards generated successfully!');
            navigate(`/practice/ai-${response.data._id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to generate flashcards');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Upload PDF for Flashcards</h3>
                            <form onSubmit={handleUpload}>
                                <div className="mb-4">
                                    <label className="form-label">Select PDF Document</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="d-grid gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={!file || loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" />
                                                Generating Flashcards...
                                            </>
                                        ) : (
                                            'Generate Flashcards'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PDFUploader;