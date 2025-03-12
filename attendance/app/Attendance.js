import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, ActivityIndicator, Picker } from "react-native";
import axios from "axios";

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/test-db" ||
          "https://magnum-attendance-1qbg.vercel.app/api/test-db"
      );
      setAttendanceData(response.data);
      setFilteredData(response.data);
      setError(null);
    } catch (error) {
      console.error("❌ Error fetching attendance data:", error);
      setError("Failed to load attendance data.");
    }
    setLoading(false);
  };

  const handleFilter = () => {
    let filtered = attendanceData;

    if (selectedEmployee) {
      filtered = filtered.filter((record) => record.Employee_Name === selectedEmployee);
    }

    if (selectedDate) {
      filtered = filtered.filter((record) => record.PunchDate === selectedDate);
    }

    setFilteredData(filtered);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Records</Text>

      {loading && <ActivityIndicator size="large" color="#007BFF" />}

      <View style={styles.filters}>
        <Picker
          selectedValue={selectedEmployee}
          onValueChange={(value) => setSelectedEmployee(value)}
        >
          <Picker.Item label="Select Employee" value="" />
          {[...new Set(attendanceData.map((record) => record.Employee_Name))].map((name) => (
            <Picker.Item key={name} label={name} value={name} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedDate}
          onValueChange={(value) => setSelectedDate(value)}
        >
          <Picker.Item label="Select Date" value="" />
          {[...new Set(attendanceData.map((record) => record.PunchDate))].map((date) => (
            <Picker.Item key={date} label={date} value={date} />
          ))}
        </Picker>

        <Button title="OK" onPress={handleFilter} />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      {/* Heading Section */}
      <View style={styles.headingContainer}>
        <Text style={styles.headingText}>Employee Name | Status | Date | In Time | Out Time  | Total Working Hours</Text>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.recordItem}>
            <Text style={styles.text}>{item.Employee_Name} | {item.Status} | {item.PunchDate} | {item.InTime || '--'} | {item.OutTime || '--'}  | {item.Actual_Working_Hours || '--'}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noRecords}>No records found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  filters: { marginBottom: 20 },
  error: { color: "red", textAlign: "center", marginBottom: 10 },
  headingContainer: { backgroundColor: "#d3d3d3", padding: 10, borderRadius: 5, marginBottom: 5 },
  headingText: { fontWeight: "bold", color: "#000" },
  recordItem: {
    backgroundColor: "#e6f7ff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007BFF",
  },
  text: { fontWeight: "bold", color: "#333" },
  noRecords: { textAlign: "center", color: "#999", marginTop: 20 },
});

export default Attendance;
