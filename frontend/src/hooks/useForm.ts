import React, { useState, ChangeEvent } from 'react';

const useForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        designation: '',
        collegeId: '',
        collegeName: '',
        phone: '',
        email: '',
        photo: null as File | null,
        reason: '',
        researchPaper: null as File | null,
        committeeMember: '', // Add committeeMember here
    });

    // Handle changes to input fields
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = event.target;

        if (type === 'file') {
            const inputElement = event.target as HTMLInputElement;
            const file = inputElement.files ? inputElement.files[0] : null;
            setFormData((prevData) => ({
                ...prevData,
                [name]: file
            }));
        } else {
            if (name === 'designation') {
                let updatedData = {
                    ...formData,
                    [name]: value,
                };

                if (value === 'Vice-Chancellor' || value === 'Council Member') {
                    updatedData = {
                        ...updatedData,
                        collegeId: '',
                        collegeName: '',
                        committeeMember: value === 'Council Member' ? '' : formData.committeeMember,
                    };
                }

                setFormData(updatedData);
            } else {
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: value
                }));
            }
        }
    };

    // Reset the form data
    const resetForm = () => {
        setFormData({
            name: '',
            designation: '',
            collegeId: '',
            collegeName: '',
            phone: '',
            email: '',
            photo: null,
            reason: '',
            researchPaper: null,
            committeeMember: '', // Reset committeeMember field
        });
    };

    return { formData, handleChange, resetForm, setFormData };
};

export default useForm;
