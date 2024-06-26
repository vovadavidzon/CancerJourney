import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { Study } from "@components/StudyCard";

interface StudyDetailsRouteParams {
  study: Study;
  imageUrl: string;
}

type StudyDetailsRouteProp = RouteProp<
  { StudyDetails: StudyDetailsRouteParams },
  "StudyDetails"
>;

const StudyDetails = () => {
  const route = useRoute<StudyDetailsRouteProp>();
  const { study, imageUrl } = route.params;

  const {
    identificationModule: { briefTitle, organization },
    statusModule: { overallStatus, startDateStruct, completionDateStruct },
    descriptionModule: { briefSummary },
    conditionsModule: { conditions },
  } = study.protocolSection;

  const imageUrlBackUp = require("@assets/cancerstudy.jpg");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={imageUrl ? { uri: imageUrl } : imageUrlBackUp}
        style={styles.image}
      />
      <Text style={styles.title}>{briefTitle}</Text>
      <View style={styles.infoRow}>
        <Ionicons name="business-outline" size={16} color="#555" />
        <Text
          style={styles.infoText}
        >{`Organization: ${organization.fullName}`}</Text>
      </View>
      <View style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={16} color="#555" />
        <Text
          style={styles.infoText}
        >{`Start Date: ${startDateStruct.date}`}</Text>
      </View>
      <View style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={16} color="#555" />
        <Text
          style={styles.infoText}
        >{`Completion Date: ${completionDateStruct.date}`}</Text>
      </View>
      <View style={styles.infoRow}>
        <Ionicons name="alert-circle-outline" size={16} color="#555" />
        <Text
          style={styles.infoText}
        >{`Overall Status: ${overallStatus}`}</Text>
      </View>
      <View style={styles.infoRow}>
        <Ionicons name="medkit-outline" size={16} color="#555" />
        <Text style={styles.infoText}>{`Conditions: ${conditions.join(
          ", "
        )}`}</Text>
      </View>
      <Text style={styles.summary}>{briefSummary}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
    paddingBottom: 120,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#555",
    marginLeft: 10,
  },
  summary: {
    fontSize: 16,
    color: "#333",
    marginTop: 20,
  },
});

export default StudyDetails;
