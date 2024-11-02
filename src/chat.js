import {
  firestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc,
  getDoc,
  auth,
} from '../src/config'

const messagesList = document.getElementById('messagesList')
const messageForm = document.getElementById('messageForm')
const messageInput = document.getElementById('messageInput')
const chatSubmitButton = document.getElementById('chat-submit') // Get the submit button

// Function to get user profile data with caching
const getUserProfile = async (uid) => {
  // Check local storage first
  const cachedProfile = JSON.parse(localStorage.getItem(`userProfile_${uid}`))

  if (cachedProfile) {
    return cachedProfile // Return cached data
  }

  // If not cached, fetch from Firestore
  const userDoc = doc(firestore, 'users', uid)
  const docSnapshot = await getDoc(userDoc)
  if (docSnapshot.exists()) {
    const userProfile = docSnapshot.data()
    // Cache the user profile
    localStorage.setItem(`userProfile_${uid}`, JSON.stringify(userProfile))
    return userProfile
  } else {
    console.error('User profile not found')
    return null
  }
}

// Function to send messages
const sendMessage = async (e) => {
  e.preventDefault()
  e.stopPropagation()

  const user = auth.currentUser // Assuming user is set elsewhere in your app
  if (!user) {
    console.error('User not authenticated')
    return
  }

  const messageText = messageInput.value.trim()

  if (!messageText) {
    console.error('Message input is empty')
    return
  }

  // Clear the input field immediately
  messageInput.value = ''

  // Get user profile to fetch pictureUrl
  const userProfile = await getUserProfile(user.uid)
  const photoURL = userProfile ? userProfile.pictureUrl : 'default_image_url'

  // Optimistically add the message to the UI
  const messageElement = document.createElement('div')
  messageElement.classList.add('message', 'sent')
  messageElement.innerHTML = `
    <img src="${photoURL}" alt="User Avatar" style="width: 40px; height: 40px; border-radius: 50%;" />
    <p>${messageText}</p>
  `
  messagesList.appendChild(messageElement)
  messagesList.scrollTop = messagesList.scrollHeight

  try {
    await addDoc(collection(firestore, 'messages'), {
      text: messageText,
      createdAt: new Date(),
      uid: user.uid,
      photoURL: photoURL,
    })
  } catch (error) {
    console.error('Error adding document: ', error)
    // Optionally remove the optimistically added message if there's an error
    messagesList.removeChild(messageElement)
  }
}

// Listen for new messages in real-time
const messagesQuery = query(
  collection(firestore, 'messages'),
  orderBy('createdAt', 'asc'),
  limit(50) // Adjust the limit as needed
)

onSnapshot(messagesQuery, (querySnapshot) => {
  messagesList.innerHTML = ''
  querySnapshot.forEach((doc) => {
    const msg = doc.data()
    const messageClass = msg.uid === auth.currentUser.uid ? 'sent' : 'received'
    const messageElement = document.createElement('div')
    messageElement.classList.add('message', messageClass)
    messageElement.innerHTML = `
      <img src="${
        msg.photoURL || 'default_image_url'
      }" alt="User Avatar" style="width: 40px; height: 40px; border-radius: 50%;" />
      <p>${msg.text}</p>
    `
    messagesList.appendChild(messageElement)
  })
  messagesList.scrollTop = messagesList.scrollHeight
})

// Add event listener to the form
messageForm.addEventListener('submit', sendMessage)

// Add event listener to the submit button
chatSubmitButton.addEventListener('click', sendMessage)

// Add event listener for the Enter key
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    sendMessage(e)
  }
})
