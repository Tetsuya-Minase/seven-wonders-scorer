export const getGreeting = () => cy.get('h1');

// ユーザーカードリストを取得するヘルパー関数
export const getUserCardList = () => cy.get('ul');

// ユーザーカードアイテムを取得するヘルパー関数
export const getUserCards = () => cy.get('seven-wonders-scorer-user-card');

// ユーザー追加フォームを取得するヘルパー関数
export const getUserForm = () => cy.get('form');

// ユーザー名入力フィールドを取得するヘルパー関数
export const getUsernameInput = () => cy.get('input[formControlName="username"]');

// 追加ボタンを取得するヘルパー関数
// より具体的なセレクターを使用し、first()で最初の一致する要素だけを選択
export const getAddButton = () => cy.get('form button[type="submit"]').first();
