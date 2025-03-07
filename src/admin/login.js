import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/login.css';

const API_BASE_URL = 'https://shfe-diplom.neto-server.ru'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email || !password) {
            alert('Пожалуйста, заполните все поля!');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/login`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: email,
                    password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Успешная авторизация:', data);
                navigate('/admin');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Неверный логин или пароль');
            }
        } catch (error) {
            console.error('Ошибка при авторизации:', error);
            setError('Произошла ошибка при авторизации');
        }
    };

    return (
        <div className='continer container-login'>
            <div className='row row-header-login'> 
                <div className='cul'>
                <h1 className='heading-login'>
                    <strong>ИДЁМ</strong>
                    <span className='span'>В</span>
                    <strong>КИНО</strong>
                </h1>
                <p className='text-login'>администраторская</p>
                </div>
            </div>
            <section className='row-section-login'>
                <header className='cul cul-header-section'>
                    <h2 className='heading-section'>авторизация</h2>
                </header>
                <div className='cul cul-form-section'>
                    <form onSubmit={handleSubmit} className='form-container'>
                        <div className='form-group'>
                            <input 
                                type='email'
                                id='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label htmlFor='email'>Email:</label>
                        </div>      
                        <div className='form-group'>
                            <input 
                                type='password'
                                id='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label htmlFor='password'>Пароль:</label>
                        </div>  
                        {error && <p className='error-message'>{error}</p>}
                        <div className='button-block'>
                            <button type='submit' className='button-form'>
                                <p className='text-login-button-form'>Авторизоваться</p>
                                </button>
                        </div>
                    </form>        
                </div>                
            </section>
        </div>
    );
};

export default Login;