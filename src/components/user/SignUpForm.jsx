import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { css } from "@emotion/react";

import FormFieldErrorMessage from "../common/FormFieldErrorMessage";
import PrimaryButton from "../common/buttons/PrimaryButton";
import TextInputWrapper from "./TextInputWrapper";
import AlertMessage from "../common/AlertMessage";
import useAlertMessage from "../../hooks/useAlertMessage";
import useSignUp from "../../hooks/queries/users/useSignUp";
import useNotificationsWithRedirect from "../../hooks/useNotificationsWithRedirect";
import pageUrl from "../../utils/pageUrl";
import {
  emailValidation,
  passwordCheckValidation,
  passwordValidation,
  usernameValidation
} from "../../utils/formValidation";
import {
  emailValidationErrorMessage, passwordCheckValidationErrorMessage,
  passwordValidationErrorMessage,
  usernameValidationErrorMessage
} from "../../utils/formValidationErrorMessage";

const SignUpForm = () => {
  const { redirectThenNotifySuccess } = useNotificationsWithRedirect();
  const { alertMessage, setAlertMessage, removeAlertMessage } = useAlertMessage();
  const signUpMutation = useSignUp();
  const { register, handleSubmit, getValues, formState: { errors } } = useForm({
    mode: "onChange"
  });

  const onValidationSucceeded = useCallback(({ username, email, password }) => {
    signUpMutation.mutate(
      { username, email, password },
      {
        onSuccess: () => {
          redirectThenNotifySuccess({
            to: pageUrl.getLoginPageUrl(),
            replace: true,
            content: "계정이 생성되었습니다. 로그인 해주세요."
          });
        },
        onError: (error) => {
          if(error.response) {
            const { code } = error.response.data;
            if(code === "user-001") {
              setAlertMessage("이미 사용중인 유저이름입니다.");
            } else if(code === "user-002") {
              setAlertMessage("이미 사용중인 이메일입니다.");
            }
          }
        }
      }
    );
  }, []);

  return (
    <form noValidate onSubmit={handleSubmit(onValidationSucceeded)}
          css={theme => css`
            display: flex;
            flex-direction: column;
            row-gap: ${theme.spacing[4]};
          `}
    >
      {alertMessage && <AlertMessage message={alertMessage} onCloseButtonClicked={removeAlertMessage} />}
      <TextInputWrapper>
        <label htmlFor="username">유저이름</label>
        <input
          {...register("username", {
            required: usernameValidationErrorMessage.required,
            minLength: {
              value: usernameValidation.minLength,
              message: usernameValidationErrorMessage.length
            },
            maxLength: {
              value: usernameValidation.maxLength,
              message: usernameValidationErrorMessage.length
            },
            pattern: {
              value: usernameValidation.pattern,
              message: usernameValidationErrorMessage.pattern
            }
          })}
          type="text"
          id="username"
          placeholder="username"
        />
        <FormFieldErrorMessage message={errors.username?.message} />
      </TextInputWrapper>
      <TextInputWrapper>
        <label htmlFor="email">이메일</label>
        <input
          {...register("email", {
            required: emailValidationErrorMessage.required,
            pattern: {
              value: emailValidation.pattern,
              message: emailValidationErrorMessage.pattern
            }
          })}
          type="email"
          id="email"
          placeholder="example@example.com"
        />
        <FormFieldErrorMessage message={errors.email?.message} />
      </TextInputWrapper>
      <TextInputWrapper>
        <label htmlFor="password">비밀번호</label>
        <input
          {...register("password", {
            required: passwordValidationErrorMessage.required,
            minLength: {
              value: passwordValidation.minLength,
              message: passwordValidationErrorMessage.length
            },
            maxLength: {
              value: passwordValidation.maxLength,
              message: passwordValidationErrorMessage.length
            },
            pattern: {
              value: passwordValidation.pattern,
              message: passwordValidationErrorMessage.pattern
            }
          })}
          type="password"
          id="password"
          placeholder="********"
        />
        <FormFieldErrorMessage message={errors.password?.message} />
      </TextInputWrapper>
      <TextInputWrapper>
        <label htmlFor="passwordCheck">비밀번호 확인</label>
        <input
          {...register("passwordCheck", {
            required: passwordCheckValidationErrorMessage.required,
            validate: {
              equalsToPassword: passwordCheck => passwordCheckValidation.equalsToPassword({
                password: getValues("password"),
                passwordCheck
              }) || passwordCheckValidationErrorMessage.equalsToPassword
            }
          })}
          type="password"
          id="passwordCheck"
          placeholder="********"
        />
        <FormFieldErrorMessage message={errors.passwordCheck?.message} />
      </TextInputWrapper>
      <PrimaryButton disabled={signUpMutation.isLoading} type="submit">
        계정 만들기
      </PrimaryButton>
    </form>
  );
};

export default SignUpForm;
