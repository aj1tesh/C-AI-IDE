#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

class Calculator {
private:
    std::string name;
    
public:
    Calculator(const std::string& n) : name(n) {}
    
    int add(int a, int b) {
        return a + b;
    }
    
    int multiply(int a, int b) {
        return a * b;
    }
    
    void displayName() {
        std::cout << "Calculator: " << name << std::endl;
    }
};

int main() {
    std::cout << "Hello, C++ AI IDE!" << std::endl;
    
    // Create a calculator instance
    Calculator calc("MyCalculator");
    calc.displayName();
    
    // Demonstrate some operations
    int result1 = calc.add(10, 20);
    int result2 = calc.multiply(5, 6);
    
    std::cout << "10 + 20 = " << result1 << std::endl;
    std::cout << "5 * 6 = " << result2 << std::endl;
    
    // Demonstrate vector operations
    std::vector<int> numbers = {3, 1, 4, 1, 5, 9, 2, 6};
    
    std::cout << "Original numbers: ";
    for (int num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    std::sort(numbers.begin(), numbers.end());
    
    std::cout << "Sorted numbers: ";
    for (int num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    return 0;
} 