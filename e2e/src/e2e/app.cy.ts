import { getUserCardList, getUserForm, getUsernameInput, getAddButton } from '../support/app.po';

describe('seven-wonders-scorer', () => {
  beforeEach(() => cy.visit('/'));

  it('should display user cards list and form', () => {
    // ユーザーカードリストが表示されることを確認
    getUserCardList().should('exist');
    
    // ユーザー追加フォームが表示されることを確認
    getUserForm().should('exist');
    
    // ユーザー名入力フィールドが表示されることを確認
    getUsernameInput().should('have.attr', 'placeholder', 'ユーザー名を入力');
    
    // 追加ボタンが表示されることを確認
    getAddButton().contains('追加');
  });

  it('should add a new user when form is submitted', () => {
    const testUsername = 'テストユーザー';
    
    // ユーザー名を入力
    getUsernameInput().type(testUsername);
    
    // フォームを送信
    getAddButton().click();
    
    // ユーザーカードリストに新しいユーザーが追加されたことを確認
    cy.contains(testUsername).should('exist');
  });

  it('should show validation error when submitting empty username', () => {
    // 空のユーザー名でフォームを送信
    getUsernameInput().clear();
    getAddButton().click();
    
    // エラーメッセージが表示されることを確認
    cy.contains('ユーザー名を入力して下さい。').should('be.visible');
  });
});
