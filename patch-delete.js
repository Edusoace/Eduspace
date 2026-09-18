const fs = require('fs');

try {
  let js = fs.readFileSync('script.js', 'utf8');

  const deleteCode = `
// Delete Article Logic
async function deleteArticle(id) {
  if (!confirm('ნამდვილად გსურთ ამ სტატიის წაშლა?')) return;

  if (typeof supabase === 'undefined') {
    alert('Supabase client is not initialized!');
    return;
  }

  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);

  if (error) {
    alert('შეცდომა წაშლისას: ' + error.message);
  } else {
    alert('სტატია წარმატებით წაიშალა!');
    location.reload();
  }
}
`;

  if (!js.includes('deleteArticle')) {
    fs.appendFileSync('script.js', '\n' + deleteCode, 'utf8');
    console.log('Delete logic added to script.js!');
  } else {
    console.log('Delete logic already exists.');
  }

} catch (err) {
  console.error('Execution error:', err);
}