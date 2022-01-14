import React from 'react'
import { Button, Descriptions } from 'antd';
import { useDispatch } from 'react-redux';

function SearchInfo(props) {
    const dispatch = useDispatch();

    return (
        <div>
            <Descriptions title="Search Info">
                <Descriptions.Item label="name">{props.detail.name}</Descriptions.Item>
                <Descriptions.Item label="email">{props.detail.email}</Descriptions.Item>


            </Descriptions>

            <br />
            <br />
            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button size="large" shape="round" type="danger">
                    Add to Cart
                </Button>
                {/* <Button herf={'/reviewpage'}size="large" shape="round" type="danger">
                    Review Pages
                </Button> */}
            </div>


        </div>
    )
}

export default SearchInfo
