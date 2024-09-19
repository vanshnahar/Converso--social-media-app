import React from "react"
import Post from '../Post'
import { useContext } from "react"
import { TwitterContext } from '../../context/TwitterContext'
const style = {
    wrapper: `no-scrollbar`,
    header: `sticky top-0 bg-[#15202b] z-10 p-4 flex justify-between items-center`,
    headerTitle: `text-xl font-bold`,
  }

const ProfileTweets = ()=>{
  const { currentAccount, currentUser } = useContext(TwitterContext)
    return(
        <div className={style.wrapper}>
        {currentUser.tweets?.map((tweet, index) => (
          console.log("file url received in rendering tweets ",tweet),
          <Post
          key={index}
          displayName={
            currentUser.name === 'Unnamed' 
              ? `${currentUser.walletAddress.slice(
                  0,
                  4
                )}...${currentUser.walletAddress.slice(41)}`
              : currentUser.name
          }
          userName={`${currentAccount.slice(
            0,
            4
          )}...${currentAccount.slice(41)}`}
          text={tweet.tweet}
          postImage={tweet.fileUrl}
          avatar={currentUser.profileImage}
          timestamp={tweet.timestamp}
          isProfileImageNft={currentUser.isProfileImageNft}
        />
        ))}
      </div>
    )
}

export default ProfileTweets