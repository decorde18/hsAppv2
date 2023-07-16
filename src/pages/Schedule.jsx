import ScheduleTable from '../features/games/ScheduleTable';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

function Schedule() {
  return <ScheduleTable />;
}

export default Schedule;

// <Document>
//   <Page size="Letter" style={styles.page}>
//     <View style={styles.section}>
//       <Text><ScheduleTable /></Text>
//     </View>

//   </Page>
// </Document>;
