import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Rate, Form, Input, Select, Checkbox } from 'antd';
import Style from './style/Main.module.css';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const options = [
    { label: '书籍', value: '0' },
    { label: '电影', value: '1' },
    { label: '电视剧', value: '2' },
    { label: '动漫', value: '3' }
];

const { Option } = Select;

function Main(props) {
    const [dataSource, setDataSource] = useState();
    // const [rateDisabled,setRateDisabled] = useState(true);
    const getAll = () => {
        axios({
            method: "get",
            url: "http://192.168.50.83:4000/getSource",
        }).then(res => {
            let list = res.data.data.map(item => {
                let scoreAfter = item.score;
                return (
                    <div key={item.code} style={{ margin: "60px 50px 50px 0px", display: "inline-block", textAlign: "left" }}>
                        <p>名称：{item.name}</p>
                        <p>类型：{item.type === "0" ? "书籍" : item.type}</p>
                        <div>
                            <span>评分：{item.score}</span>
                            <Rate defaultValue={item.score} style={{ display: "block" }} onChange={(value) => { scoreAfter = value }} />
                        </div>
                        <Button type="default" onClick={() => { changeScore(item.code, scoreAfter) }}>评分</Button>
                        <Button type="default" onClick={() => { deleteSource(item.code) }} style={{ marginLeft: 5 }}>删除</Button>
                    </div>
                )
            })
            setDataSource(list)
        })
    }
    useEffect(
        () => {
            getAll();
        }, []
    );
    const changeScore = (code, scoreAfter) => {
        // setRateDisabled(!rateDisabled)
        axios({
            method: "post",
            url: "http://192.168.50.83:4000/score/update",
            params: {
                code: code,
                score: scoreAfter
            }
        }).then(res => {
            getAll();
        })
    }

    const onFinish = values => {
        console.log('Success:', values);
        axios({
            method: "get",
            url: "http://192.168.50.83:4000/getSource",
        }).then(res => {
            values.code = 1 + Number(res.data.data.sort((a, b) => {
                return b.code - a.code;
            })[0].code);
            console.log(values);
            axios({
                method: "post",
                url: "http://192.168.50.83:4000/source/add",
                data: values
            }).then(res => {
                getAll();
                setAddData(false);
            })
        })
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const deleteSource = (code) => {
        axios({
            method: "delete",
            url: "http://192.168.50.83:4000/source/delete",
            params: {
                code: code
            }
        }).then(res => {
            console.log(res)
            getAll();
        })
    }

    const [addData, setAddData] = useState(false);

    function onChange(checkedValues) {
        // console.log('checked = ', checkedValues);
        axios({
            method: "get",
            url: "http://192.168.50.83:4000/getSource/type",
            params: {
                type: checkedValues
            }
        }).then(res => {
            let list = res.data.data.map(item => {
                let scoreAfter = item.score;
                return (
                    <div key={item.code} style={{ margin: "60px 50px 50px 0px", display: "inline-block", textAlign: "left" }}>
                        <p>名称：{item.name}</p>
                        <p>类型：{item.type === "0" ? "书籍" : item.type}</p>
                        <div>
                            <span>评分：{item.score}</span>
                            <Rate defaultValue={item.score} style={{ display: "block" }} onChange={(value) => { scoreAfter = value }} />
                        </div>
                        <Button type="default" onClick={() => { changeScore(item.code, scoreAfter) }}>评分</Button>
                        <Button type="default" onClick={() => { deleteSource(item.code) }} style={{ marginLeft: 5 }}>删除</Button>
                    </div>
                )
            })
            setDataSource(list)
        })
    }
    return (
        <div className={Style.Main}>
            <Button style={{ position: "absolute", top: "30px", left: 0 }} onClick={() => { setAddData(!addData) }}>添加作品</Button>
            <Button onClick = {() => {props.setLoginSucess(false); cookies.set('loginSucess', false)}}>退出</Button>
            <Checkbox.Group options={options} defaultValue={['0','1','2','3']} onChange={onChange} style = {{color:"#fff"}}/>
            <div className={Style.dataSource}>
                {dataSource}
            </div>

            {
                addData ?
                    <Form
                        {...layout}
                        name="basic"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        style={{ margin: "0 auto", color: "#fff", position: "absolute", top: "40px", left: "100px" }}
                    >
                        <Form.Item
                            label="名称"
                            name="name"
                            rules={[{ required: true, message: '请输入作品名称' }]}
                        >
                            <Input style={{ width: 200 }} />
                        </Form.Item>

                        <Form.Item
                            label="类型"
                            name="type"
                            rules={[{ required: true, message: '请选择作品类型' }]}
                        >
                            <Select
                                style={{ width: 200 }}
                                placeholder="请选择作品类型"
                            >
                                <Option key="0">书籍</Option>
                                <Option key="1">电影</Option>
                                <Option key="2">电视剧</Option>
                                <Option key="3">动漫</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="评分"
                            name="score"
                            rules={[{ required: true, message: '请设置作品评分' }]}
                        >
                            <Rate style={{ width: 200 }} />
                        </Form.Item>

                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit" style={{ marginLeft: 45 }}>
                                添加
                            </Button>
                        </Form.Item>
                    </Form> : null
            }

        </div>
    );
}

export default Main;
