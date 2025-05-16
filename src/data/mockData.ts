import { Event } from '../types';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Summer Music Festival 2025',
    description: 'Experience the hottest artists of the summer at this three-day music extravaganza. From pop to rock to electronic music, there\'s something for everyone.',
    date: 'Jul 15-17, 2025',
    time: '12:00 PM - 11:00 PM',
    location: 'Central Park, New York',
    venue: 'Central Park Main Stage',
    address: '59th St, New York, NY 10022',
    price: 0.5,
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Music Festival',
    availableSeats: 500,
    earlyAccess: true,
    lineup: [
      { name: 'The Sound Wave', time: '8:00 PM - 10:00 PM' },
      { name: 'Electric Pulse', time: '6:00 PM - 7:30 PM' },
      { name: 'Harmony Heights', time: '4:00 PM - 5:30 PM' },
      { name: 'Beat Collective', time: '2:00 PM - 3:30 PM' }
    ]
  },
  {
    id: '2',
    title: 'Electronic Dance Night',
    description: 'Join us for a night of electronic music with world-class DJs and an incredible light show. This will be the electronic event of the year.',
    date: 'Jun 20, 2025',
    time: '10:00 PM - 4:00 AM',
    location: 'Warehouse District, Miami',
    venue: 'Club Electro',
    address: '123 Beats St, Miami, FL 33127',
    price: 0.45,
    image: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Electronic',
    availableSeats: 200,
    earlyAccess: true,
    lineup: [
      { name: 'DJ Pulse', time: '2:00 AM - 4:00 AM' },
      { name: 'Beat Master', time: '12:00 AM - 2:00 AM' },
      { name: 'Rhythm Queen', time: '10:00 PM - 12:00 AM' }
    ]
  },
  {
    id: '3',
    title: 'Rock Revolution Tour',
    description: 'The biggest rock bands come together for an unforgettable night of classic and modern rock hits. Get ready to rock!',
    date: 'Aug 5, 2025',
    time: '7:00 PM - 11:30 PM',
    location: 'Arena Stadium, Los Angeles',
    venue: 'LA Arena',
    address: '1111 S Figueroa St, Los Angeles, CA 90015',
    price: 0.6,
    image: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Rock',
    availableSeats: 100,
    earlyAccess: false,
    lineup: [
      { name: 'Stone Crushers', time: '9:30 PM - 11:30 PM' },
      { name: 'The Amplifiers', time: '8:00 PM - 9:00 PM' },
      { name: 'Guitar Heroes', time: '7:00 PM - 7:45 PM' }
    ]
  },
  {
    id: '4',
    title: 'Jazz & Blues Night',
    description: 'An intimate evening of smooth jazz and soulful blues performed by renowned musicians in a historic venue with perfect acoustics.',
    date: 'Sep 12, 2025',
    time: '8:00 PM - 11:00 PM',
    location: 'Historic Theater, Chicago',
    venue: 'Blue Note Theater',
    address: '456 Jazz Ave, Chicago, IL 60601',
    price: 0.35,
    image: 'https://images.pexels.com/photos/5117913/pexels-photo-5117913.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Jazz',
    availableSeats: 150,
    earlyAccess: false,
    lineup: [
      { name: 'Smooth Quartet', time: '9:30 PM - 11:00 PM' },
      { name: 'Blues Brothers Tribute', time: '8:00 PM - 9:15 PM' }
    ]
  },
  {
    id: '5',
    title: 'Classical Symphony Night',
    description: 'Experience the majesty of a full orchestra performing classic masterpieces from Mozart, Beethoven, and Tchaikovsky.',
    date: 'Oct 8, 2025',
    time: '7:30 PM - 10:00 PM',
    location: 'Symphony Hall, Boston',
    venue: 'Boston Symphony Hall',
    address: '301 Massachusetts Ave, Boston, MA 02115',
    price: 0.5,
    image: 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Classical',
    availableSeats: 80,
    earlyAccess: true,
    lineup: [
      { name: 'Metropolitan Symphony Orchestra', time: '7:30 PM - 10:00 PM' }
    ]
  },
  {
    id: '6',
    title: 'Hip Hop Summit',
    description: 'The biggest names in hip hop come together for an epic celebration of rap, breakdancing, and street art.',
    date: 'Nov 15, 2025',
    time: '6:00 PM - 1:00 AM',
    location: 'Urban Center, Atlanta',
    venue: 'The Beat Box',
    address: '789 Flow St, Atlanta, GA 30303',
    price: 0.55,
    image: 'https://images.pexels.com/photos/8412414/pexels-photo-8412414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Hip Hop',
    availableSeats: 300,
    earlyAccess: false,
    lineup: [
      { name: 'Rhyme Masters', time: '11:00 PM - 1:00 AM' },
      { name: 'Flow Kings', time: '9:00 PM - 10:30 PM' },
      { name: 'Beat Droppers', time: '7:00 PM - 8:30 PM' },
      { name: 'New School Crew', time: '6:00 PM - 6:45 PM' }
    ]
  },
  {
    id: '7',
    title: 'Country Music Roundup',
    description: 'Grab your boots and hats for this authentic country music experience with line dancing, BBQ, and the best country artists.',
    date: 'May 20, 2025',
    time: '5:00 PM - 11:00 PM',
    location: 'Fairgrounds, Nashville',
    venue: 'Nashville Fairgrounds',
    address: '625 Smith Ave, Nashville, TN 37203',
    price: 0.4,
    image: 'https://images.pexels.com/photos/111287/pexels-photo-111287.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Country',
    availableSeats: 250,
    earlyAccess: true,
    lineup: [
      { name: 'Southern Comfort Band', time: '9:00 PM - 11:00 PM' },
      { name: 'Heartland Heroes', time: '7:00 PM - 8:30 PM' },
      { name: 'Country Roads', time: '5:00 PM - 6:30 PM' }
    ]
  },
  {
    id: '8',
    title: 'Indie Music Showcase',
    description: 'Discover the next big thing in music at this showcase of indie talent from around the world. Multiple stages, food trucks, and art installations.',
    date: 'Apr 15, 2025',
    time: '4:00 PM - 12:00 AM',
    location: 'Arts District, Portland',
    venue: 'The Independent',
    address: '321 Indie St, Portland, OR 97209',
    price: 0.3,
    image: 'https://images.pexels.com/photos/196652/pexels-photo-196652.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'Indie',
    availableSeats: 120,
    earlyAccess: false,
    lineup: [
      { name: 'Acoustic Dreams', time: '10:00 PM - 12:00 AM' },
      { name: 'The Originals', time: '8:00 PM - 9:30 PM' },
      { name: 'Underground Sounds', time: '6:00 PM - 7:30 PM' },
      { name: 'New Wave', time: '4:00 PM - 5:30 PM' }
    ]
  },
];