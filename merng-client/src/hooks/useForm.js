import { useState } from 'react';

export const useForm = (callback, initialState = {}) => {
  const [values, setValue] = useState(initialState);

  const handleChange = (e) => {
    setValue({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    callback();
  };

  return { handleChange, handleSubmit, values };
};
