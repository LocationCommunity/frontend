import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './SignUp.css'; // CSS 파일을 import합니다.

const SignUp = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('signUpRequest', new Blob([JSON.stringify({
      email: data.email,
      password: data.password,
      checkPassword: data.checkPassword,
      name: data.name,
      nickname: data.nickname,
      introduction: data.introduction,
    })], { type: 'application/json' }));
    formData.append('file', data.file[0]);

    try {
      const response = await axios.post('/members/sign-up', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      if (response.status === 200) {
        Swal.fire('Congratulation!', '가입을 축하합니다.', 'success').then(() => {
          navigate('/members/login');
        });
      }
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          {...register('email', {
            required: '이메일은 공백일 수 없습니다.',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: '이메일 형식이 올바르지 않습니다.',
            },
          })}
        />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>

      <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          {...register('password', {
            required: '비밀번호는 공백일 수 없습니다.',
          })}
        />
        {errors.password && <span className="error">{errors.password.message}</span>}
      </div>

      <div className="form-group">
        <label>Confirm Password:</label>
        <input
          type="password"
          {...register('checkPassword', {
            required: '비밀번호 확인은 공백일 수 없습니다.',
            validate: value =>
              value === watch('password') || '비밀번호가 일치하지 않습니다.',
          })}
        />
        {errors.checkPassword && <span className="error">{errors.checkPassword.message}</span>}
      </div>

      <div className="form-group">
        <label>Name:</label>
        <input
          {...register('name', {
            required: '이름은 공백일 수 없습니다.',
          })}
        />
        {errors.name && <span className="error">{errors.name.message}</span>}
      </div>

      <div className="form-group">
        <label>Nickname:</label>
        <input
          {...register('nickname', {
            required: '닉네임은 공백일 수 없습니다.',
          })}
        />
        {errors.nickname && <span className="error">{errors.nickname.message}</span>}
      </div>

      <div className="form-group">
        <label>Introduction:</label>
        <textarea {...register('introduction')} />
      </div>

      <div className="form-group">
        <label>Profile Picture:</label>
        <input type="file" {...register('file', { required: true })} />
        {errors.file && <span className="error">프로필 사진은 필수입니다.</span>}
      </div>

      <button type="submit" className="submit-button">Sign Up</button>
    </form>
  );
};

export default SignUp;
