const { db, reset } = require('./db');
const Book = require('./models/Book');
const Member = require('./models/Member');
const Borrowing = require('./models/Borrowing');

reset();

console.log('🧪 Testing all methods...\n');

// Test Book.js
console.log('📚 Testing Book.js...');
console.log('Available books:', Book.getAvailable().length);
console.log('Search results:', Book.search('Harry').length);
const newBookId = Book.add('Test Book', 'Test Author');
console.log('Added book ID:', newBookId);

// Test Member.js
console.log('\n👤 Testing Member.js...');
const borrowed = Member.getBorrowedBooks(1);
console.log('Books borrowed by member #1:', borrowed.length);
const newMemberId = Member.add('Test User', 'test@email.com', '0899999999');
console.log('Added member ID:', newMemberId);

// Test Borrowing.js
console.log('\n📖 Testing Borrowing.js...');
const borrowId = Borrowing.borrow(2, 1);
console.log('Borrow ID:', borrowId);
const success = Borrowing.returnBook(borrowId);
console.log('Return success:', success);
const unreturned = Borrowing.getUnreturned();
console.log('Unreturned books:', unreturned.length);

console.log('\n✅ All tests completed!');

db.close();