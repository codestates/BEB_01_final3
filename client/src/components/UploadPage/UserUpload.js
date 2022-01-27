import React, { useState } from 'react'
import { Typography, Button, Form, Input, message } from 'antd';
import Dropzone from 'react-dropzone';
import { PlusOutlined } from '@ant-design/icons/lib/icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import UserImg from './UserImg';

const { TextArea } = Input
const { Title, Text } = Typography

const PrivateOptions = [
    { value: 0, label: 'Private' },
    { value: 1, label: 'Public' },
]

const CategoryOptions = [
    { value: 1, label: 'GeneralContents' },
]
const UploadPage = (props) => {

    const navigate = useNavigate();
    const user = useSelector((state) => state.user)
  //크롬 redux스토어 도구를 보면 user라는 state가 있다.
  //해당 state의 모든 json 데이터 들이 user라는 변수에 담긴다.

    const [VideoTitle, setVideoTitle] = useState('')
    const [Description, setDescription] = useState('')
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState('GeneralContents')
    const [FilePath, setFilePath] = useState('')
    const [Duration, setDuration] = useState('')
    const [ThumbnailPath, setThumbnailPath] = useState('')
    const [Opendate, setOpenDate] = useState('')
    const [Survival, setSurvival] = useState('')
    const [Image, setImage] = useState([])

    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value)
    }
    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }
    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value)
    }
    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value)
    }
    const onDateChange = (e) => {
        setOpenDate(e.currentTarget.value)
    }
    const onSurvivalList = (e) => {
        setSurvival(e.currentTarget.value)
    }
    const updateImages = (newImages) => {
        setImage(newImages)
    }

    const onDrop = (files) => {
        //올린파일에대한 정보가 files에대입

        let formData = new FormData()
        const config = {
            header: { 'content-type': 'multipart/form-data' },
        }

        formData.append('file', files[0])

        axios.post('/api/user/video/uploads', formData, config).then((response) => {
            if (response.data.success) {
                console.log('Video', response.data)

                let variable = {
                    url: response.data.url,
                    fileName: response.data.fileName,
                };
                console.log('url', response.data.url)
                console.log('fileName', response.data.fileName)
                setFilePath(response.data.url) //동영상주소


                axios.post('/api/user/video/thumbnail', variable).then((response) => {
                    if (response.data.success) {
                        console.log('thumb', response.data)
                        setDuration(response.data.fileDuration) //동영상길이
                        setThumbnailPath(response.data.url) //썸네일주소
                    } else {
                        alert('썸네일 생성에 실패했습니다.')
                    }
                })
            } else {
                alert('비디오 업로드를 실패했습니다.')
            }
        })
    }

    const onSubmit = (e) => {
        e.preventDefault() //새로고침방지
        const variables = {
          writer: user.userData._id,
          title: VideoTitle,
          description: Description,
          privacy: Private,
          filePath: FilePath,
          category: Category,
          duration: Duration,
          thumbnail: ThumbnailPath,
          opendate: Opendate,
          survival: Survival,
          image: Image,
        }
        axios.post('/api/user/video/uploadVideo', variables).then((response) => {
          if (response.data.success) {
            message.success('성공적으로 업로드를 했습니다.')
            setTimeout(() => {
                navigate('/')
            }, 3000)
          } else {
            alert('비디오 업로드에 실패 했습니다.')
          }
        })
      }

    return (
        <div
            style={{
                maxWidth: '700px',
                marginLeft: '33%',
                // margin: '2rem auto',
                paddingTop: "100px",
            }}
        >
            <div
                style={{
                    textAlign: 'center',
                    marginBottom: '2rem',
                }}
            >
                <Title level={1} >
                    <Text >Upload Video</Text>
                </Title>
            </div>

            <Form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* Drop zone 부분*/}

                    <Dropzone
                        onDrop={onDrop}
                        multiple={false} //한번에 파일을 2개이상올릴껀지
                        maxSize={90000000000000000000} //최대사이즈 조절
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div
                                style={{
                                    width: '300px',
                                    height: '240px',
                                    border: '1px solid lightgray',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <PlusOutlined style={{ fontSize: '5rem' }} />
                            </div>
                        )}
                    </Dropzone>
                    {/* 썸네일부분 */}
                    {ThumbnailPath !== '' && (
                        <div>
                            <img src={`/${ThumbnailPath}`} alt="haha" />
                        </div>
                    )}
                </div>
                <label>Title</label>
                <Input onChange={onTitleChange} value={VideoTitle} placeholder='콘텐츠 제목' />
                <br />
                <br />
                <label>Description</label>
                <TextArea onChange={onDescriptionChange} value={Description} placeholder='콘텐츠 설명' />
                <br />
                <br />
                <select onChange={onPrivateChange}>
                    {PrivateOptions.map((
                        item,
                        index //map함수는 무조건 key값을 줘야한다.(성능문제)
                    ) => (
                        <option key={index} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
                <br />
                <br />
                <select onChange={onCategoryChange}>
                    {CategoryOptions.map((
                        item,
                        index //map함수는 무조건 key값을 줘야한다.(성능문제)
                    ) => (
                        <option key={index} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
                <br />
                <br />
                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}


export default UploadPage
