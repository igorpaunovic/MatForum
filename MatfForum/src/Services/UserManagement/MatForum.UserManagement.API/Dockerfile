# Use the official .NET 8 runtime as base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Use the SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /

# Copy solution file
COPY ["MatForum.sln", "."]

# Copy project files
COPY ["src/Services/UserManagement/MatForum.UserManagement.API/MatForum.UserManagement.API.csproj", "src/Services/UserManagement/MatForum.UserManagement.API/"]
COPY ["src/Services/UserManagement/MatForum.UserManagement.Application/MatForum.UserManagement.Application.csproj", "src/Services/UserManagement/MatForum.UserManagement.Application/"]
COPY ["src/Services/UserManagement/MatForum.UserManagement.Domain/MatForum.UserManagement.Domain.csproj", "src/Services/UserManagement/MatForum.UserManagement.Domain/"]
COPY ["src/Services/UserManagement/MatForum.UserManagement.Infrastructure/MatForum.UserManagement.Infrastructure.csproj", "src/Services/UserManagement/MatForum.UserManagement.Infrastructure/"]
COPY ["src/Shared/MatForum.Shared.Contracts/MatForum.Shared.Contracts.csproj", "src/Shared/MatForum.Shared.Contracts/"]
COPY ["src/Shared/MatForum.Shared.Domain/MatForum.Shared.Domain.csproj", "src/Shared/MatForum.Shared.Domain/"]
COPY ["src/Shared/MatForum.Shared.Infrastructure/MatForum.Shared.Infrastructure.csproj", "src/Shared/MatForum.Shared.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "src/Services/UserManagement/MatForum.UserManagement.API/MatForum.UserManagement.API.csproj"

# Copy all source code
COPY . .

# Build the application
WORKDIR "/src/Services/UserManagement/MatForum.UserManagement.API"
RUN dotnet build "MatForum.UserManagement.API.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "MatForum.UserManagement.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage - runtime image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MatForum.UserManagement.API.dll"]