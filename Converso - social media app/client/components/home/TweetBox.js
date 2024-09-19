import { useState, useContext } from 'react'
import { BsCardImage, BsEmojiSmile } from 'react-icons/bs'
import { RiFileGifLine, RiBarChartHorizontalFill } from 'react-icons/ri'
import { IoMdCalendar } from 'react-icons/io'
import { MdOutlineLocationOn } from 'react-icons/md'
import { client } from '../../lib/client'
import { TwitterContext } from '../../context/TwitterContext'
import { useRouter } from 'next/router'
import axios from 'axios'

const style = {
  wrapper: `sticky px-4 flex flex-row border-b border-[#38444d] pb-4 bg-white`,
  tweetBoxLeft: `mr-4`,
  tweetBoxRight: `flex-1`,
  profileImage: `height-12 w-12 rounded-full`,
  inputField: `w-full h-full outline-none bg-transparent text-lg text-black`,
  formLowerContainer: `flex`,
  iconsContainer: `text-[black] flex flex-1 items-center`,
  icon: `mr-2 cursor-pointer`,
  submitGeneral: `px-6 py-2 rounded-3xl font-bold text-blak`,
  inactiveSubmit: `bg-[#dbdbdb] text-[black]`,
  activeSubmit: `bg-[#989898] text-black`,
  fileInput: `hidden`,
}

function TweetBox() {
  const [tweetMessage, setTweetMessage] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const { currentAccount, tweets, currentUser } = useContext(TwitterContext)
  const router = useRouter()

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
        },
      })

      const url = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`
      setFileUrl(url)
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  const submitTweet = async (event) => {
    event.preventDefault()

    if (!tweetMessage && !fileUrl) return
    const tweetId = `${currentAccount}_${Date.now()}`

    console.log("file url after uploading on pinata and setting state", fileUrl)
    const tweetDoc = {
      _type: 'tweets',
      _id: tweetId,
      tweet: tweetMessage,
      fileUrl: fileUrl,
      timestamp: new Date(Date.now()).toISOString(),
      author: {
        _key: tweetId,
        _ref: currentAccount,
        _type: 'reference',
      },
    }

    await client.createIfNotExists(tweetDoc)

    await client
      .patch(currentAccount)
      .setIfMissing({ tweets: [] })
      .insert('after', 'tweets[-1]', [
        {
          _key: tweetId,
          _ref: tweetId,
          _type: 'reference',
        },
      ])
      .commit()

    setTweetMessage('')
    setFileUrl('')
  }

  return (
    <div className={style.wrapper}>
      <div className={style.tweetBoxLeft}>
        <img
          src={currentUser.profileImage}
          alt="profile image"
          className={
            currentUser.isProfileImageNft
              ? `${style.profileImage} smallHex`
              : style.profileImage
          }
        />
      </div>
      <div className={style.tweetBoxRight}>
        <form>
          <textarea
            onChange={e => setTweetMessage(e.target.value)}
            value={tweetMessage}
            placeholder="What's happening?"
            className={style.inputField}
          />
          <input
            type="file"
            id="fileInput"
            className={style.fileInput}
            onChange={handleFileChange}
          />
          <div className={style.formLowerContainer}>
            <div className={style.iconsContainer}>
              <label htmlFor="fileInput">
                <BsCardImage className={style.icon} />
              </label>
              <RiFileGifLine className={style.icon} />
              <RiBarChartHorizontalFill className={style.icon} />
              <BsEmojiSmile className={style.icon} />
              <IoMdCalendar className={style.icon} />
              <MdOutlineLocationOn className={style.icon} />
            </div>
            <button
              type="submit"
              onClick={event => submitTweet(event)}
              disabled={!tweetMessage && !fileUrl}
              className={`${style.submitGeneral} ${tweetMessage || fileUrl ? style.activeSubmit : style.inactiveSubmit}`}
            >
              Tweet
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TweetBox
