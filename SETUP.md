# Venturo Dynamic System Setup Guide

## 🚀 **Quick Start**

### 1. **Database Setup (Supabase)**

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Run Database Schema**
   - Copy the contents of `database-schema.sql`
   - Paste into your Supabase SQL Editor
   - Run the script to create all tables and policies

3. **Environment Variables**
   Create `.env.local` with:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

### 2. **AI Integration (Optional)**

For enhanced AI features, add to `.env.local`:
```bash
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 3. **Install Dependencies**

```bash
npm install
```

### 4. **Run Development Server**

```bash
npm run dev
```

## 🔧 **Database Functions**

Add these functions to your Supabase SQL Editor:

```sql
-- Function to increment event attendees
CREATE OR REPLACE FUNCTION increment_event_attendees(event_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE events 
  SET current_attendees = current_attendees + 1
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment idea views
CREATE OR REPLACE FUNCTION increment_idea_views(idea_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE startup_ideas 
  SET stats = jsonb_set(
    COALESCE(stats, '{"views": 0, "saves": 0, "messages": 0}'::jsonb),
    '{views}',
    (COALESCE((stats->>'views')::int, 0) + 1)::text::jsonb
  )
  WHERE id = idea_id;
END;
$$ LANGUAGE plpgsql;
```

## 🤖 **AI Features**

### Current AI Capabilities:
- **Content Moderation**: Basic word filtering (expandable to OpenAI)
- **Auto-tagging**: Category-based tag generation
- **Content Summarization**: Automatic summary generation
- **Moderation Logging**: Track all AI decisions

### Enhanced AI Integration:
Replace the basic AI functions in API routes with OpenAI calls:

```typescript
// Example OpenAI integration
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function moderateContentWithAI(content: string) {
  const response = await openai.moderations.create({
    input: content,
  })
  
  return {
    approved: !response.results[0].flagged,
    confidence: response.results[0].categories,
    flaggedReasons: Object.keys(response.results[0].categories).filter(
      key => response.results[0].categories[key as keyof typeof response.results[0].categories]
    )
  }
}
```

## 📊 **Real-time Features**

The system includes real-time subscriptions for:
- **Events**: Live updates when new events are added
- **Messages**: Instant message notifications
- **User Activity**: Profile updates and connections

## 🔐 **Security Features**

- **Row Level Security (RLS)**: Database-level access control
- **Authentication**: Clerk integration for user management
- **Content Moderation**: AI-powered content filtering
- **Rate Limiting**: Built-in API protection

## 📈 **Analytics & Monitoring**

### Database Analytics:
- Event attendance tracking
- User engagement metrics
- Content moderation logs
- Performance monitoring

### AI Analytics:
- Moderation accuracy tracking
- Content quality metrics
- User behavior analysis

## 🚀 **Deployment**

### Vercel Deployment:
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Database Migration:
- Supabase automatically handles migrations
- Schema changes are version controlled
- Zero-downtime deployments

## 🔄 **Content Management**

### Automatic Updates:
- **Events**: Real-time from database
- **Ideas**: Dynamic loading with AI enhancement
- **User Profiles**: Live updates with role selection
- **Messages**: Instant delivery with real-time subscriptions

### Manual Overrides:
- Admin panel for content moderation
- Manual event approval system
- User role management
- Content editing capabilities

## 📱 **Mobile Optimization**

- Responsive design for all screen sizes
- Touch-friendly interactions
- Optimized loading states
- Offline capability (coming soon)

## 🔧 **Customization**

### Brand Colors:
All colors are defined in `app/globals.css`:
- Navy: #0B1E3C
- Teal: #21C087
- Gold: #F5B800
- Light BG: #F6F7F9
- White: #FFFFFF

### Content Types:
- Events with AI moderation
- Startup ideas with auto-tagging
- User profiles with role selection
- Messages with real-time delivery

## 🆘 **Support**

For technical support:
- Email: support@joinventuro.com
- Documentation: This guide
- GitHub Issues: For bug reports

## 🎯 **Next Steps**

1. **Set up Supabase** and run the schema
2. **Configure environment variables**
3. **Test the API routes** with real data
4. **Deploy to production**
5. **Monitor and optimize** performance

Your Venturo platform is now fully dynamic with AI-powered features! 🚀
