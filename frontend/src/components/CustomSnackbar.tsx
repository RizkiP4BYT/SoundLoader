import { Alert, Snackbar, LinearProgress, SnackbarProps } from '@mui/joy'
import { MdCheckCircle, MdErrorOutline } from 'react-icons/md'
import React from 'react'

interface CustomSnackbarProps extends SnackbarProps {
    open: boolean
    onClose: () => void
    message: string | null
    severity: 'success' | 'error' | 'loading'
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({ open, onClose, message, severity, ...otherProps }) => {
    const getIcon = () => {
        switch (severity) {
            case 'success':
                return <MdCheckCircle fontSize={50} />
            case 'error':
                return <MdErrorOutline fontSize={50} />
            case 'loading':
                return null // Atau ikon loading yang sesuai
            default:
                return null
        }
    }

    const color = severity === 'success' ? 'success' : severity === 'error' ? 'danger' : 'neutral'

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="soft"
            color={color}
            open={open}
            autoHideDuration={severity === 'loading' ? null : 3000}
            onClose={(event, reason) => {
                if (reason === 'clickaway') {
                    return
                }
                onClose()
            }}
            startDecorator={getIcon()}
            {...otherProps}
        >
            <Alert variant="soft" color={color} invertedColors size="lg">
                {message}
            </Alert>
            {severity === 'loading' && (
                <LinearProgress
                    variant="solid"
                    color={color}
                    value={40}
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        borderRadius: 0
                    }}
                />
            )}
        </Snackbar>
    )
}

export default CustomSnackbar
