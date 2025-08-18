# R7 Admin Dashboard - All Entries

A comprehensive admin dashboard for TESDA Region VII that displays all entries from different provinces and accounts in a centralized, filterable interface.

## Features

### 🎯 Summary Cards
- **Provincial Overview**: Clickable cards showing total, pending, and completed entries for each province
- **Real-time Updates**: Automatically updates counts as data changes
- **Interactive Filtering**: Click any province card to filter the table below

### 🔍 Advanced Filtering
- **Search Bar**: Search by name, ticket number, or email
- **Province Filter**: Filter by specific provinces (Cebu, Bohol, Negros Oriental, Siquijor)
- **Status Filter**: Filter by application status (Pending, Completed, Spam)
- **Account Filter**: Filter by registry accounts
- **Date Filter**: Filter by submission date
- **Clear Filters**: One-click reset of all filters

### 📊 Data Table
- **Comprehensive View**: Shows all entry details in an organized table
- **Sortable Columns**: Easy to scan and organize information
- **Pagination**: Navigate through large datasets efficiently
- **Action Buttons**: View, edit, and delete entries directly from the table

### 📈 Export Functionality
- **CSV Export**: Download filtered data for external analysis
- **Date-stamped Files**: Automatic filename generation with current date

## File Structure

```
r7admindash/
├── index.html          # Main dashboard HTML file
├── styles.css          # Dashboard styling and responsive design
├── dashboard.js        # Dashboard functionality and Firebase integration
└── README.md           # This documentation file
```

## Setup Instructions

1. **Place Files**: Ensure all files are in the `r7admindash/` directory
2. **Firebase Configuration**: The dashboard uses the existing Firebase configuration from your project
3. **Authentication**: Users must be logged in to access the dashboard
4. **Access Control**: Different user accounts have different province access levels

## User Access Levels

| Email | Province Access | Description |
|-------|----------------|-------------|
| `r7po.registry@gmail.com` | Cebu | Cebu Provincial Registry |
| `r7po46.registry@gmail.com` | Negros Oriental | Negros Oriental Provincial Registry |
| `r7po12.registry@gmail.com` | Bohol | Bohol Provincial Registry |
| `r7po61.registry@gmail.com` | Siquijor | Siquijor Provincial Registry |
| `region7@tesda.gov.ph` | All Provinces | Region 7 Admin (Full Access) |

## Key Features Explained

### Summary Cards
Each province card displays:
- **Total Entries**: All applications from that province
- **Pending Entries**: Applications awaiting processing
- **Completed Entries**: Successfully processed applications

Clicking a card automatically filters the table to show only entries from that province.

### Search and Filters
- **Search**: Real-time search across names, ticket numbers, and emails
- **Province Filter**: Dropdown to select specific provinces
- **Status Filter**: Filter by application processing status
- **Account Filter**: Filter by the registry account that submitted the entry
- **Date Filter**: Filter by the date the entry was submitted

### Table Actions
- **View**: Opens a modal with detailed entry information
- **Edit**: Placeholder for future edit functionality
- **Delete**: Placeholder for future delete functionality

### Responsive Design
The dashboard is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices
- Different screen sizes and orientations

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with CSS Grid, Flexbox, and custom properties
- **JavaScript ES6+**: Modern JavaScript with classes and async/await
- **Firebase**: Real-time database and authentication
- **Responsive Design**: Mobile-first approach with breakpoints

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Performance Features
- **Lazy Loading**: Firebase data loaded on-demand
- **Pagination**: Large datasets handled efficiently
- **Debounced Search**: Search input optimized for performance
- **Real-time Updates**: Live data synchronization

## Customization

### Styling
The dashboard uses CSS custom properties (variables) for easy theming:
- Primary colors
- Accent colors
- Border styles
- Shadow effects
- Typography

### Adding New Provinces
To add new provinces:
1. Update the `provinces` array in `dashboard.js`
2. Add corresponding HTML elements in `index.html`
3. Update CSS classes in `styles.css`

### Modifying Filters
Additional filters can be added by:
1. Adding HTML form elements
2. Updating the `currentFilters` object
3. Modifying the `applyFilters()` function

## Troubleshooting

### Common Issues

**Dashboard not loading:**
- Check Firebase configuration
- Verify user authentication
- Check browser console for errors

**Data not displaying:**
- Ensure Firebase connection is working
- Check user permissions
- Verify data structure in Firebase

**Styling issues:**
- Ensure `styles.css` is properly linked
- Check for CSS conflicts
- Verify file paths are correct

### Error Messages
- **"Error loading applications"**: Firebase connection issue
- **"Access denied"**: User authentication or permission problem
- **"No entries found"**: Filter criteria too restrictive

## Future Enhancements

- **Bulk Actions**: Select multiple entries for batch operations
- **Advanced Analytics**: Charts and graphs for data visualization
- **User Management**: Admin tools for managing user accounts
- **Audit Logs**: Track changes and user actions
- **Email Notifications**: Automated alerts for new entries
- **Mobile App**: Native mobile application version

## Support

For technical support or feature requests, contact the development team or refer to the existing TESDA Region VII documentation.

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Compatibility**: TESDA R7 Forms System
