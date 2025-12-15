import {useState} from 'react';
import './ErrorsPage.css';
import { Link } from 'react-router-dom';

   const errorPaths = {
        400: {
            title: 'Bad Request',
            message: 'The server could not understand the request due to invalid syntax.',
            redirect: '/dashboard',
        },
        401: {
            title: 'Unauthorized',
            message: 'You are not authorized to access this resource. Please log in.',
            redirect: '/login',
        },
        403: {
            title: 'Forbidden',
            message: 'You do not have permission to access this resource.',
            redirect: '/dashboard',
        },
        404:  {
            title: 'Not Found',
            message: 'The requested resource could not be found.',
            redirect: `/dashboard`,
        },
        500: {
            title: 'Internal Server Error',
            message: 'The server encountered an internal error. Please try again later.',
            redirect: '/login',
        },
    };


export const ErrorsHandling = ({children, errorCode}) => {

    const errorTitle = errorPaths[errorCode]?.title || 'Error';
    const errorMessage = errorPaths[errorCode]?.message || 'An unexpected error has occurred.';
    const errorRedirect = errorPaths[errorCode]?.redirect || '/';

    return (
      <>
        {errorCode ? (
        <div className="errors-page-bg">
            <div className="errors-page-card">
                <div className="errors-page-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="22" fill="#fff" stroke="#e53935" strokeWidth="3"/>
                    <rect x="22" y="13" width="4" height="16" rx="2" fill="#e53935"/>
                    <rect x="22" y="33" width="4" height="4" rx="2" fill="#e53935"/>
                  </svg>
                </div>
                <h1 className="errors-page-title">{errorTitle}</h1>
                <p className="errors-page-message">{errorMessage}</p>
                <p className="errors-page-code"><span>Error Code: {errorCode}</span></p>
                <Link to={errorRedirect}><button className="btn-go-back">Go back</button></Link>
            </div>
        </div>


    ) : (
        {children}
    )}
    </>
    );
}