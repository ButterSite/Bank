import { redirect } from "react-router-dom";


export const handleError = (error) => {
    
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
        404: () => {
            if(error.redirect === false) {
                return; 
            }
            return {
                title: 'Not Found',
                message: 'The requested resource could not be found.',
                redirect: '/login',
            }},
        500: {
            title: 'Internal Server Error',
            message: 'The server encountered an internal error. Please try again later.',
            redirect: '/login',
        },
    };


    return {
        title,
        message,
        code: error.code || '000',
    };
};