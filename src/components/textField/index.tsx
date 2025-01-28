import React from 'react';
import { Field, ErrorMessage } from 'formik';

interface TextFieldProps {
  name: string;
  placeholder: string;
  type: string;
  className?: string;
}

const TextField: React.FC<TextFieldProps> = ({ name, placeholder, type, className }) => {
  return (
    <div className="w-full">
      <Field
        type={type}
        name={name}
        placeholder={placeholder}
        className={`w-full px-4 py-2 bg-black text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-400 text-sm ${className}`}
      />
      <ErrorMessage name={name} component="div" className="text-red-500 text-sm" />
    </div>
  );
};

export default TextField;
