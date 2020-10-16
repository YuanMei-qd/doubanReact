import React, { useEffect, useState } from 'react';
import './App.css';
import Main from './Main';
import CommomMain from './CommomMain';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import Cookies from 'universal-cookie';
import moment from 'moment';
import 'moment/locale/zh-cn';
const cookies = new Cookies();
function Login() {
    const onFinish = (value) => {
        axios({
            method: "post",
            url: "http://192.168.50.83:4000/login",
            params: value
        }).then(res => {
            console.log(res.data)
            if (res.data.sucess) {
                cookies.set('loginSucess', true, { expires: new Date(moment().add(6, 'h').format()), path: '/' });
                cookies.set('nickname', res.data.nickname, { expires: new Date(moment().add(6, 'h').format()), path: '/' });
                cookies.set('userName', res.data.userName, { expires: new Date(moment().add(6, 'h').format()), path: '/' });
                setLoginSucess(true);
                setRoleMessage(res.data);
            } else {
                message.warning('密码错误');
            }
        })
    }
    const [loginSucess, setLoginSucess] = useState(false);
    const [roleMessage, setRoleMessage] = useState({});
    useEffect(() => {
        if (cookies.get('loginSucess') === "true") {
            setLoginSucess(true)
        }
    }, [])
    return (
        <div className="App">
            {
                !loginSucess ?
                    <Form
                        // name="basic"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        style={{ margin: "0 auto", color: "#fff", position: "absolute", top: "40px", left: "100px" }}
                    >
                        <Form.Item
                            label="名称"
                            name="userName"
                            rules={[{ required: true, message: '请输入用户名' }]}
                        >
                            <Input style={{ width: 200 }} />
                        </Form.Item>
                        <Form.Item
                            label="密码"
                            name="password"
                            rules={[{ required: true, message: '请输入密码' }]}
                        >
                            <Input style={{ width: 200 }} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ marginLeft: 45 }}>
                                添加
                            </Button>
                        </Form.Item>
                    </Form> :
                    (
                        roleMessage.role === "Administrator" ? <Main setLoginSucess={setLoginSucess} /> : <CommomMain setLoginSucess={setLoginSucess} roleMessage = {roleMessage}/>
                    )

            }
        </div>
    );
}

export default Login;
