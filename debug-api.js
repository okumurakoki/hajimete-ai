// 講義作成APIテスト用スクリプト
// ブラウザのコンソールで実行してください

async function testCourseCreation() {
  console.log('🔍 講義作成APIテストを開始...')
  
  try {
    const testCourse = {
      title: 'テスト講義',
      description: 'これはAPIテスト用の講義です',
      departmentId: '1',
      thumbnail: '',
      difficulty: 'beginner',
      duration: 45,
      videoUrl: '',
      status: 'draft'
    }
    
    console.log('📤 送信データ:', testCourse)
    
    const response = await fetch('/api/admin/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCourse)
    })
    
    console.log('📊 レスポンスステータス:', response.status)
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ 作成成功:', result)
      
      // 講義一覧を取得して確認
      const listResponse = await fetch('/api/admin/courses')
      if (listResponse.ok) {
        const courses = await listResponse.json()
        console.log('📋 現在の講義一覧:', courses)
        console.log('📊 講義数:', courses.length)
      }
    } else {
      const error = await response.json()
      console.error('❌ 作成失敗:', error)
    }
    
  } catch (error) {
    console.error('🚨 APIテストエラー:', error)
  }
}

// 使用方法:
console.log('📝 講義作成APIテストスクリプトが読み込まれました')
console.log('💡 実行するには: testCourseCreation()')