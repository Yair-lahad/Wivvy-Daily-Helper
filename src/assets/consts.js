// src/assets/consts.jsx
import {
  Briefcase, Dumbbell, BookOpen, Coffee, Heart,
  Home, Car, ShoppingCart, Users, Music
} from 'lucide-react';

export const taskIcons = {
  work: { icon: Briefcase, color: 'blue', label: 'Work' },
  exercise: { icon: Dumbbell, color: 'green', label: 'Exercise' },
  study: { icon: BookOpen, color: 'purple', label: 'Study' },
  coffee: { icon: Coffee, color: 'amber', label: 'Coffee' },
  health: { icon: Heart, color: 'red', label: 'Health' },
  home: { icon: Home, color: 'gray', label: 'Home' },
  travel: { icon: Car, color: 'indigo', label: 'Travel' },
  shopping: { icon: ShoppingCart, color: 'pink', label: 'Shopping' },
  social: { icon: Users, color: 'orange', label: 'Social' },
  music: { icon: Music, color: 'teal', label: 'Music' }
};

export const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
