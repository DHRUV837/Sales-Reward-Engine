FROM gradle:8.5-jdk21 AS build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
# Ensure JAVA_HOME is set correctly and use Gradle wrapper
ENV JAVA_HOME=/opt/java/openjdk
RUN chmod +x ./gradlew && ./gradlew clean build --no-daemon -x test

FROM eclipse-temurin:21-jdk-alpine
VOLUME /tmp
COPY --from=build /home/gradle/src/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Xmx384m", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/app.jar"]
