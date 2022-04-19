import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { Stack, Card, TextField, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// ----------------------------------------------------------------------

type InitialValues = {
  newPassword: string;
  confirmNewPassword: string;
  afterSubmit?: string;
};

export default function VerifyCodeForm() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { updatePassword } = useAuth();
  const isMountedRef = useIsMountedRef();
  const [searchParams] = useSearchParams();

  const VerifyCodeSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required('No password provided.')
      .min(8, 'Password is too short - should be 8 chars minimum.')
      .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('No password provided.')
  });

  const formik = useFormik<InitialValues>({
    initialValues: {
      newPassword: '',
      confirmNewPassword: ''
    },
    validationSchema: VerifyCodeSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      console.log('qkfopqwgwoqp');
      try {
        let code = searchParams.get('code') !== null ? searchParams.get('code')! : '';
        const response = await updatePassword?.(
          code,
          values.newPassword,
          values.confirmNewPassword
        );
        console.log('response:', response);
        if (isMountedRef.current && response && response.status === 200) {
          enqueueSnackbar('Your password was successfully changed', { variant: 'success' });
          navigate(PATH_DASHBOARD.root);
        } else {
          throw response.error;
        }
      } catch (error) {
        console.error(error);
        if (isMountedRef.current) {
          setErrors({ afterSubmit: error.message });
          enqueueSnackbar(`${error.message}`, { variant: 'error' });
          setSubmitting(false);
        }
      }
    }
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <Card sx={{ p: 3 }}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3} alignItems="flex-end">
            {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}
            <TextField
              {...getFieldProps('newPassword')}
              fullWidth
              autoComplete="on"
              type="password"
              label="New Password"
              error={Boolean(touched.newPassword && errors.newPassword)}
              helperText={touched.newPassword && errors.newPassword}
            />

            <TextField
              {...getFieldProps('confirmNewPassword')}
              fullWidth
              autoComplete="on"
              type="password"
              label="Confirm New Password"
              error={Boolean(touched.confirmNewPassword && errors.confirmNewPassword)}
              helperText={touched.confirmNewPassword && errors.confirmNewPassword}
            />
          </Stack>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{ mt: 3 }}
          >
            Save Changes
          </LoadingButton>
        </Form>
      </FormikProvider>
    </Card>
  );
}
