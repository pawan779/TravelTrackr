import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import ScreenWrapper from "../components/screenWrapper";
import { Colors } from "../../theme";
import { ExpenseProps, VisitedPlacesProps } from "../types/Types";
import EmptyList from "../components/emptyList";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../components/backButton";
import ExpenseCard from "../components/expenseCard";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { auth, expensesRef, tripsRef } from "../config/firebase";
import { query, where } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
import Entypo from "@expo/vector-icons/Entypo";

interface TripExpensesProps {
  route: {
    params: VisitedPlacesProps;
  };
}

const TripExpensesScreen: React.FC<TripExpensesProps> = (props) => {
  const { place, country, id } = props?.route?.params;
  const [expenses, setExpenses] = React.useState<ExpenseProps[]>([]);

  const { user } = useSelector((state: any) => state.user);
  const navigaiton: any = useNavigation();
  const isFocused = useIsFocused();

  const fetchExpenses = async () => {
    const q = query(expensesRef, where("tripId", "==", id));
    const querySnapshot = await getDocs(q);
    let data: ExpenseProps[] = [];

    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data(), id: doc.id });
    });

    setExpenses(data);
  };

  useEffect(() => {
    if (isFocused) {
      fetchExpenses();
    }
  }, [isFocused]);

  return (
    <ScreenWrapper>
      <View className="px-4 flex-1">
        <View className="relative mt-5">
          <View className="absolute top-0 left-0 z-10">
            <BackButton />
          </View>
          <Text className={`${Colors.heading} text-xl font-bold text-center`}>
            {place}
          </Text>
          <Text className={`${Colors.heading} text-xs  text-center`}>
            {country}
          </Text>

          <TouchableOpacity
            className="absolute top-0 right-0 z-10"
            onPress={() =>
              navigaiton.navigate("Chart", { expenses, place, country })
            }
          >
            <Entypo name="pie-chart" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center items-center rounded-xl  mb-4">
          <Image
            source={require("../../assets/images/7.png")}
            className="w-80 h-80"
          />
        </View>

        <View className="space-y-4 flex-1">
          <View className="flex-row justify-between items-center">
            <Text className={`${Colors.heading} font-bold text-xl`}>
              Recent Trips
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigaiton.navigate("AddExpense", { id, place, country })
              }
              className="p-2 px-3 bg-white border border-gray-200 rounded-full"
            >
              <Text className={Colors.heading}>Add Expense</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={expenses}
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ flex: 1 }}
            ListEmptyComponent={
              <EmptyList message="You haven't recorded any expenses yet" />
            }
            showsVerticalScrollIndicator={false}
            keyExtractor={(items) => items.id.toString()}
            renderItem={({ item }) => <ExpenseCard {...item} />}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default TripExpensesScreen;
