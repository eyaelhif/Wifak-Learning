import { Component } from '@angular/core';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent {

  discussions = [
    { author: 'Amine R.', role: 'Compliance Officer', title: 'How are you handling enhanced due diligence for crypto-exposed clients?', replies: 24, likes: 87, tag: 'AML' },
    { author: 'Sofia M.', role: 'Risk Analyst', title: 'Best practices for Basel III stress testing in mid-sized banks', replies: 18, likes: 62, tag: 'Risk' },
    { author: 'Karim B.', role: 'Branch Manager', title: 'Customer trust after a fraud incident — what worked for your team?', replies: 41, likes: 134, tag: 'Leadership' },
    { author: 'Nour H.', role: 'Digital Banking Lead', title: 'e-KYC rollout: friction vs. compliance — finding the balance', replies: 12, likes: 49, tag: 'Digital' },
  ];

  leaderboard = [
    { name: 'Yasmine K.', xp: 12480, badge: '🥇' },
    { name: 'Tarek A.', xp: 11920, badge: '🥈' },
    { name: 'Leila N.', xp: 10840, badge: '🥉' },
    { name: 'Omar F.', xp: 9720, badge: '' },
    { name: 'Salma D.', xp: 8650, badge: '' },
  ];

  getInitials(name: string): string {
    return name.split(' ').map(s => s[0]).join('');
  }
}