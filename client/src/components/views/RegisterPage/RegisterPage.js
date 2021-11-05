import React, {useState, useEffect} from "react";
import moment from "moment";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from "../../../_actions/user_actions";
import { useDispatch } from "react-redux";
import Axios from 'axios';

import {
  Form,
  Input,
  Button,
} from 'antd';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function RegisterPage(props) {

  const [Email, setEmail] = useState('')
  const [Secret, setSecret] = useState('')  //서버에서 받은 인증번호
  const [SecretFromUser, setSecretFromUser] = useState('')
  const [ActiveButton, setActiveButton] = useState('')

  const onChangeGetFromUser = (e) => {
    setSecretFromUser(e.currentTarget.value)
  }

  const onClickSendEmail = () => {
    let body = { Email }
    Axios.post('/api/users/sendEmail',body)
      .then(response => {
        setSecret(response.data.randNum)
      })
  }
  const onClickCheck = () => {
    console.log("Secret",Secret)
    console.log("SecretFromUser",SecretFromUser)
    if(Secret == SecretFromUser){
      alert('성공')
      setActiveButton('true')
    } else {
      alert('실패')
      setActiveButton('')
    }
  }

  

  

  const dispatch = useDispatch();
  return (

    <Formik
      initialValues={{
        email: '',
        lastName: '',
        name: '',
        password: '',
        confirmPassword: ''
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .required('Name is required'),
        lastName: Yup.string()
          .required('Last Name is required'),
        email: Yup.string()
          .email('Email is invalid')
          .required('Email is required'),
        password: Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required('Confirm Password is required')
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {

          let dataToSubmit = {
            email: values.email,
            password: values.password,
            name: values.name,
            lastname: values.lastname,
            image: `http://gravatar.com/avatar/${moment().unix()}?d=identicon`
          };

          dispatch(registerUser(dataToSubmit)).then(response => {
            if (response.payload.success) {
              props.history.push("/login");
            } else {
              alert(response.payload.err.errmsg)
            }
          })

          setSubmitting(false);
        }, 500);
      }}
    >
      {props => {
        const {
          values,
          touched,
          errors,
          dirty,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset,
        } = props;

        return (
          <div className="app">
            <h2>Sign up</h2>
            <Form style={{ minWidth: '375px' }} {...formItemLayout} onSubmit={handleSubmit} >

              <Form.Item required label="Name">
                <Input
                  id="name"
                  placeholder="Enter your name"
                  type="text"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.name && touched.name ? 'text-input error' : 'text-input'
                  }
                />
                {errors.name && touched.name && (
                  <div className="input-feedback">{errors.name}</div>
                )}
              </Form.Item>
              

              <Form.Item required label="Last Name">
                <Input
                  id="lastName"
                  placeholder="Enter your Last Name"
                  type="text"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.lastName && touched.lastName ? 'text-input error' : 'text-input'
                  }
                />
                {errors.lastName && touched.lastName && (
                  <div className="input-feedback">{errors.lastName}</div>
                )}
              </Form.Item>

              <Form.Item required label="Email" hasFeedback validateStatus={errors.email && touched.email ? "error" : 'success'}>
                <Input
                  onCheck={values.email}
                  id="email"
                  placeholder="Enter your Email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.email && touched.email ? 'text-input error' : 'text-input'
                  }
                />
                {errors.email && touched.email && (
                  <div className="input-feedback">{errors.email}</div>
                )}
                {touched.email  && setEmail(values.email) }             
              </Form.Item>
              {/*{touched.email && console.log(values.email)} => 여기서 이메일 매순간 체크한다.*/}
              <div style={{display: 'flex', justifyContent:'flex-end'}}>
                <Input onChange={onChangeGetFromUser} placeholder="Basic usage" style={{ width: '40%' }}/>
                <Button type="primary" onClick={onClickSendEmail} >이메일 전송</Button>
                <Button type="primary" onClick={onClickCheck} >Check</Button>
                {/*작동 순서 : 
                  1. 이메일 입력
                  2. 버튼두개 (서버에서 email 보낼 버튼, 확인 버튼)
                  3. 확인 버튼으로 확인하기
                */}
              </div>
              <Form.Item required label="Password" hasFeedback validateStatus={errors.password && touched.password ? "error" : 'success'}>
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.password && touched.password ? 'text-input error' : 'text-input'
                  }
                />
                {errors.password && touched.password && (
                  <div className="input-feedback">{errors.password}</div>
                )}
              </Form.Item>

              <Form.Item required label="Confirm" hasFeedback>
                <Input
                  id="confirmPassword"
                  placeholder="Enter your confirmPassword"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.confirmPassword && touched.confirmPassword ? 'text-input error' : 'text-input'
                  }
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <div className="input-feedback">{errors.confirmPassword}</div>
                )}
              </Form.Item>

              <Form.Item {...tailFormItemLayout}>
                <Button onClick={handleSubmit} type="primary" disabled={!ActiveButton && !isSubmitting}>  {/*disable 조절로 경우 2개 나온다. 이메일 인증하고 바로 버튼 액티브 or 이메일 인증하고 모든 항목 다 체크하고 액티브 현재는 전자 후자로 하려면 &&를 ||로 바꿔야*/}
                  Submit
                </Button>
              </Form.Item>
            </Form>
            <button onClick ={() => console.log("eee")} type="primary" disabled={!ActiveButton}>       {/*입력되면 버튼 활성화 구현완료*/}
              Test
            </button>
          </div>
        );
      }}
    </Formik>
  );
};


export default RegisterPage
