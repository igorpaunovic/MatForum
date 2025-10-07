FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/Services/QuestionAnswer/MatForum.QuestionAnswer.API/MatForum.QuestionAnswer.API.csproj", "src/Services/QuestionAnswer/MatForum.QuestionAnswer.API/"]
COPY ["src/Services/QuestionAnswer/MatForum.QuestionAnswer.Application/MatForum.QuestionAnswer.Application.csproj", "src/Services/QuestionAnswer/MatForum.QuestionAnswer.Application/"]
COPY ["src/Services/QuestionAnswer/MatForum.QuestionAnswer.Domain/MatForum.QuestionAnswer.Domain.csproj", "src/Services/QuestionAnswer/MatForum.QuestionAnswer.Domain/"]
RUN dotnet restore "src/Services/QuestionAnswer/MatForum.QuestionAnswer.API/MatForum.QuestionAnswer.API.csproj"
COPY . .
WORKDIR "/src/src/Services/QuestionAnswer/MatForum.QuestionAnswer.API"
RUN dotnet build "./MatForum.QuestionAnswer.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./MatForum.QuestionAnswer.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MatForum.QuestionAnswer.API.dll"]
